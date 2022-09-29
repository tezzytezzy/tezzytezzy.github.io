var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from 'dotenv';
import request from 'superagent';
import fs from 'fs';
config();
function getJson(url) {
    return __awaiter(this, void 0, void 0, function* () {
        // Try http://httpstat.us/200 to test out different status codes
        return request
            .get(url)
            .accept('application/json')
            .ok(res => res.status < 500) // Any HTTP status codes < 500 as success
            .then(res => {
            return res.text;
        });
    });
}
function getCompDir() {
    return __awaiter(this, void 0, void 0, function* () {
        function getCompDirUrl(secCount) {
            return "https://asx.api.markitdigital.com/asx-research/1.0/companies/directory?page=0&itemsPerPage="
                + secCount
                + "&order=ascending&orderBy=companyName&includeFilterOptions=true&recentListingsOnly=false";
        }
        // Only to get total security count
        const oneSecData = yield getJson(getCompDirUrl(1));
        if (oneSecData) {
            const allSecCount = JSON.parse(oneSecData)["data"]["count"];
            const allSecData = yield getJson(getCompDirUrl(allSecCount));
            if (allSecData) {
                return Promise.resolve(JSON.parse(allSecData)["data"]["items"]);
            }
        }
    });
}
function createAsxFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        const compDirData = yield getCompDir();
        if (compDirData) {
            let secPerIndustryData = []; // An array of array, so not just compDir but compDir[]
            let secAllData = [];
            let secTotalCounter = 1;
            let secIndsutryCounter = 1;
            // Take out only unique industry names and sort them
            const industryList = Array.from(new Set(compDirData.map((sec) => sec.industry))).sort();
            const symbolList = compDirData.map((secOrig) => secOrig.symbol);
            writeAsxFile(compDirData, "comp-basic-data.json");
            // Once all the sec data gets merged it's hard to separate them into industries, as ALL the object porperties need to be mapped
            // 1. Sparate secs into their industries
            // 2. Fetch extra data from header and keystats
            // 3. Append them to the industryList
            // 4. Pop them into a newly created array, secAllData, keeping the same order
            industryList.forEach((industryName) => {
                // Loop though each industry name, filter all the companies by it, and pop them into an array
                secPerIndustryData.push(compDirData.filter((sec) => { return sec.industry === industryName; }));
            });
            // Output in Github Actions
            function padWithZeros(num) {
                // Return a 4-digit number. A negative number does nothing with .substring()
                return ('000' + num.toString()).slice(-4);
            }
            // .forEach loop is SYNCHRONOUS, so use the old-style 'for' loop
            // NOT: secPerIndustryData.forEach(async (industry, industryIdx) => {
            for (let industryIdx in secPerIndustryData) {
                let secListPerIndustry = [];
                const industryCounter = padWithZeros(secIndsutryCounter);
                console.log(industryList[industryIdx] + "(" + (parseInt(industryIdx) + 1) + " of " + secPerIndustryData.length + ")");
                for (let secCompDir of secPerIndustryData[industryIdx]) {
                    const url = "https://asx.api.markitdigital.com/asx-research/1.0/companies/" + secCompDir.symbol;
                    let mergedSecData = secCompDir;
                    const res = yield Promise.allSettled([getJson(url + "/header"),
                        getJson(url + "/key-statistics")]);
                    res.forEach(result => {
                        if (result.status == "fulfilled") {
                            // Merge into the original data
                            // Somehow only status property is available to 'result', so use index assessor i.e. ['value']
                            mergedSecData = Object.assign(mergedSecData, JSON.parse(result["value"])["data"]);
                        }
                    });
                    secListPerIndustry.push(mergedSecData);
                    secAllData[symbolList.indexOf(secCompDir.symbol)] = mergedSecData;
                    // Add 2-second stoppage at every 50th security, so as not to overwhelm memory
                    if (secTotalCounter % 50 == 0) {
                        yield new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    console.log(padWithZeros(secTotalCounter) + ":" + industryCounter + ": " + secCompDir.symbol);
                    secTotalCounter += 1;
                }
                function getIndustryFileName(industryName) {
                    // Use '??', nullish coalescing operator. True when 'null' or 'undefined'
                    // industryList inlcudes 'undefined' after sorted
                    // (27) ['Automobiles & Components', 'Banks', 'Capital Goods', 'Class Pend', 'Commercial & Professional Services', 
                    //       'Consumer Durables & Apparel', 'Consumer Services', 'Diversified Financials', 'Energy', 
                    //       'Food & Staples Retailing', 'Food, Beverage & Tobacco', 'Health Care Equipment & Services',
                    //       'Household & Personal Products', 'Insurance', 'Materials', 'Media & Entertainment', 'Not Applic',
                    //       'Pharmaceuticals, Biotechnology & Life Sciences', 'Real Estate', 'Retailing', 
                    //       'Semiconductors & Semiconductor Equipment', 'Software & Services', 'Technology Hardware & Equipment',
                    //       'Telecommunication Services', 'Transportation', 'Utilities', undefined]
                    // E.g. securities below with 'undefined' industry
                    // 26: (3) [{…}, {…}, {…}]
                    // 0: {symbol: 'FND', displayName: 'FINDI LIMITED', marketCap: 10103445, xid: '591676895', priceChangeFiveDayPercent: -11.111111111111109, …}
                    // 1: {symbol: 'HLF', displayName: 'HALO FOOD CO. LIMITED', marketCap: 20038487, xid: '479285162', priceChangeFiveDayPercent: 0, …}
                    // 2: {symbol: '1CG', displayName: 'UUV AQUABOTIX LTD', xid: '403789822', priceChangeFiveDayPercent: 0, isRecentListing: false}
                    return (industryName !== null && industryName !== void 0 ? industryName : "Not Classified").split(' ').join('-').toLowerCase() + ".json";
                }
                yield writeAsxFile(secListPerIndustry, getIndustryFileName(industryList[industryIdx]));
                secIndsutryCounter += 1;
            }
            yield writeAsxFile(secAllData, "comp-full-data.json");
            yield writeAsxFile(new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney', dateStyle: 'full', timeStyle: 'long' }), "lastupdate.log");
        }
        else {
            console.error("No data");
        }
    });
}
function writeAsxFile(data, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const str = JSON.stringify(data, null, 2);
            const dirName = (process.env.GITHUB_ACTIONS_ROOT_DIR || process.cwd()) + "/dist/data/";
            // On a local machine this 'undefined' process.env.GITHUB_ACTIONS_ROOT_DIR gives 'false'
            // This way, no need to set up a secret on Github Actions.
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName);
            }
            const fullName = dirName + "asx-" + fileName;
            if (str.length) {
                // overwrite the existing file by default
                fs.writeFile(fullName, str, (err) => {
                    if (err) {
                        throw new Error(`Error in saving ${fullName}`);
                    }
                });
            }
            else {
                throw new Error(`Empty data in ${fullName}}`);
            }
        }
        catch (err) {
            console.error(err);
        }
    });
}
createAsxFiles();
//# sourceMappingURL=asx.js.map