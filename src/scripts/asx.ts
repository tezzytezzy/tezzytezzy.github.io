import { config } from 'dotenv'
import request from 'superagent'

import fs from 'fs'


// LOG IT
// try http://httpstat.us/200 to get diff. status code
// https://app.rawgraphs.io/ or www.koia.io

config()

// const jsonFileDir = process.cwd() + process.env.JSON_FILE_DIR + '/'

const str_test = [
  {
    "symbol": "AMP",
    "displayName": "AMP LIMITED",
    "industry": "Diversified Financials",
    "dateListed": "1998-06-15",
    "marketCap": 3772352260,
    "xid": "44817",
    "priceChangeFiveDayPercent": -3.0042918454935554,
    "isRecentListing": false
  },
  {
    "symbol": "1ST",
    "displayName": "1ST GROUP LIMITED",
    "industry": "Health Care Equipment & Services",
    "dateListed": "2015-06-09",
    "marketCap": 11593564,
    "xid": "274180515",
    "priceChangeFiveDayPercent": -9.999999999999993,
    "isRecentListing": false
  },
  {
    "symbol": "2ST",
    "displayName": "2ST GROUP LIMITED",
    "industry": "Diversified Financials",
    "dateListed": "2015-06-09",
    "marketCap": 11593564,
    "xid": "274180515",
    "priceChangeFiveDayPercent": -9.999999999999993,
    "isRecentListing": false
  }]


const key_stats = {
  "isin": "AU000000AMP6", "priceAsk": 1.1300000000000001, "priceBid": 1.125, "priceClose": 1.155, "priceDayHigh": 1.17, "priceDayLow": 1.1225, "priceFiftyTwoWeekHigh": 1.22, "priceFiftyTwoWeekLow": 0.855, "volumeAverage": 12240736.197802, "dateExDate": "2020-09-18", "datePayDate": "2020-10-01", "dateRecordDate": "2020-09-21", "dividend": 0.1, "dividendType": "I", "frankingPercent": 100, "cashFlow": 1640, "earningsPerShare": -0.07953, "freeCashFlowYield": -0.0000100000010000001, "priceEarningsRatio": -99999.99, "priceToCash": -99999.99, "foreignExempt": false, "shareDescription": "Ordinary Fully Paid", "numOfShares": 3266105853, "yieldAnnual": 0, "incomeStatement": [{ "revenue": 3081000000, "netIncome": -252000000, "period": "2021A", "fPeriodEndDate": 44561, "curCode": "AUD" }, { "revenue": 3346000000, "netIncome": 177000000, "period": "2020A", "fPeriodEndDate": 44196, "curCode": "AUD" }, { "revenue": 3950000000, "netIncome": -2467000000, "period": "2019A", "fPeriodEndDate": 43830, "curCode": "AUD" }, { "revenue": 8244000000, "netIncome": 28000000, "period": "2018A", "fPeriodEndDate": 43465, "curCode": "AUD" }]
}

// 1. Use Company Directory to get all the listed securities
// 2. Establish a list of industries to categorise each security under its belonging industry

// interface Security {
//   symbol: string // header
//   marketCap: number // header
//   priceChangeFiveDayPercent: number // SAME AS priceChangePercent IN HEADER???
//   displayName: string // header
//   industry: string // header
//   dateListed: string // header
//   xid: string // header
//   isRecentListing: boolean
// }

// 3. Append data to the original properties from Company Directory
// 3.1. https://asx.api.markitdigital.com/asx-research/1.0/companies/bhp/header
// {"data":{"dateListed":"1885-08-13",
//         "displayName":"BHP GROUP LIMITED",
//         "priceAsk":40.74,
//         "priceBid":40.730000000000004,
//         "priceChange":1.8100000000000023,
//         "priceChangePercent":4.650565262076059,
//         "priceLast":40.730000000000004,
//         "sector":"Materials",
//         "industryGroup":"Materials",
//         "securityType":1,
//         "symbol":"BHP",
//         "volume":8096299,
//         "xid":"60947",
//         "marketCap":197025618555,
//         "statusCode":""}
// }
// 3.2. https://asx.api.markitdigital.com/asx-research/1.0/companies/bhp/key-statistics
// {"data":{"isin":"AU000000BHP4",
//         "priceAsk":40.74,
//         "priceBid":40.730000000000004,
//         "priceClose":38.92,
//         "priceDayHigh":41.050000000000004,
//         "priceDayLow":39.7,
//         "priceFiftyTwoWeekHigh":53.92,
//         "priceFiftyTwoWeekLow":35.56,
//         "volumeAverage":10491864.674157,
//         "dateExDate":"2022-02-24",
//         "datePayDate":"2022-03-28",
//         "dateRecordDate":"2022-02-25",
//         "dividend":2.0806,
//         "dividendType":"I",
//         "frankingPercent":100,
//         "cashFlow":13778.04,
//         "earningsPerShare":4.51268,
//         "freeCashFlowYield":0.1823400057619442,
//         "priceEarningsRatio":8.4872,
//         "priceToCash":5.48426,
//         "foreignExempt":false,
//         "shareDescription":"Ordinary Fully Paid",
//         "numOfShares":5062323190,
//         "yieldAnnual":10.997167138810198,
//         "incomeStatement":[{"revenue":56921000000,"netIncome":11304000000,"period":"2021A","fPeriodEndDate":44377,"curCode":"USD"},{"revenue":42931000000,"netIncome":7956000000,"period":"2020A","fPeriodEndDate":44012,"curCode":"USD"},{"revenue":44288000000,"netIncome":8306000000,"period":"2019A","fPeriodEndDate":43646,"curCode":"USD"},{"revenue":43129000000,"netIncome":3705000000,"period":"2018A","fPeriodEndDate":43281,"curCode":"USD"}]}}


type security = {
  symbol: string
  marketCap: number
  priceChangeFiveDayPercent: number
  displayName: string
  industry: string
  dateListed: string
  xid: string
  isRecentListing: boolean
}

type compDir = security[]

const str2 =
  '[{"symbol":"14D","displayName":"1414 DEGREES LIMITED","industry":"Capital Goods","dateListed":"2018-09-12","marketCap":23075953,"xid":"486191506","priceChangeFiveDayPercent":0,"isRecentListing":false},{"symbol":"1ST","displayName":"1ST GROUP LIMITED","industry":"Health Care Equipment & Services","dateListed":"2015-06-09","marketCap":7052863,"xid":"274180515","priceChangeFiveDayPercent":19.760479041916163,"isRecentListing":false},{"symbol":"29M","displayName":"29METALS LIMITED","industry":"Materials","dateListed":"2021-07-02","marketCap":1249183000,"xid":"663303162","priceChangeFiveDayPercent":-1.886792452830182,"isRecentListing":false},{"symbol":"T3D","displayName":"333D LIMITED","industry":"Commercial & Professional Services","dateListed":"2006-12-27","marketCap":8412557,"xid":"5947361","priceChangeFiveDayPercent":0,"isRecentListing":false},{"symbol":"TCF","displayName":"360 CAPITAL ENHANCED INCOME FUND","industry":"Not Applic","dateListed":"2006-10-17","marketCap":23962277,"xid":"5457157","priceChangeFiveDayPercent":-1.0291595197255508,"isRecentListing":false},{"symbol":"TGP","displayName":"360 CAPITAL GROUP","industry":"Real Estate","dateListed":"2005-07-26","marketCap":192717845,"xid":"2524743","priceChangeFiveDayPercent":12.820512820512818,"isRecentListing":false},{"symbol":"TOT","displayName":"360 CAPITAL REIT","industry":"Diversified Financials","dateListed":"2015-04-22","marketCap":135056343,"xid":"86360650","priceChangeFiveDayPercent":10.404624277456655,"isRecentListing":false},{"symbol":"3MF","displayName":"3D METALFORGE LIMITED","industry":"Commercial & Professional Services","dateListed":"2021-03-02","marketCap":18441571,"xid":"636135750","priceChangeFiveDayPercent":7.777777777777785,"isRecentListing":false},{"symbol":"TDO","displayName":"3D OIL LIMITED","industry":"Energy","dateListed":"2007-05-22","marketCap":12729042,"xid":"7221947","priceChangeFiveDayPercent":3.84615384615385,"isRecentListing":false},{"symbol":"DDD","displayName":"3D RESOURCES LIMITED","industry":"Materials","dateListed":"2007-03-21","marketCap":11641116,"xid":"6393494","priceChangeFiveDayPercent":0,"isRecentListing":false},{"symbol":"3PL","displayName":"3P LEARNING LIMITED..","industry":"Consumer Services","dateListed":"2014-07-09","marketCap":458963722,"xid":"76419072","priceChangeFiveDayPercent":2.14723926380369,"isRecentListing":false},{"symbol":"4DX","displayName":"4DMEDICAL LIMITED","industry":"Health Care Equipment & Services","dateListed":"2020-08-07","marketCap":272404949,"xid":"608309060","priceChangeFiveDayPercent":-10.576923076923075,"isRecentListing":false},{"symbol":"4DS","displayName":"4DS MEMORY LIMITED","industry":"Semiconductors & Semiconductor Equipment","dateListed":"2010-12-09","marketCap":124448436,"xid":"26906406","priceChangeFiveDayPercent":8.750000000000007,"isRecentListing":false},{"symbol":"5EA","displayName":"5E ADVANCED MATERIALS INC.","industry":"Materials","marketCap":0,"xid":"688676047","isRecentListing":false},{"symbol":"88E","displayName":"88 ENERGY LIMITED","industry":"Energy","dateListed":"2000-01-20","marketCap":725742734,"xid":"230975","priceChangeFiveDayPercent":20,"isRecentListing":false},{"symbol":"8CO","displayName":"8COMMON LIMITED","industry":"Software & Services","dateListed":"2014-08-27","marketCap":36557360,"xid":"77805543","priceChangeFiveDayPercent":6.451612903225812,"isRecentListing":false},{"symbol":"8IH","displayName":"8I HOLDINGS LTD","industry":"Diversified Financials","dateListed":"2014-12-17","marketCap":64504078,"xid":"80536669","priceChangeFiveDayPercent":5.8823529411764595,"isRecentListing":false},{"symbol":"8VI","displayName":"8VI HOLDINGS LIMITED","industry":"Consumer Services","dateListed":"2015-12-16","marketCap":118667982,"xid":"320037656","priceChangeFiveDayPercent":-8.163265306122442,"isRecentListing":false},{"symbol":"9SP","displayName":"9 SPOKES INTERNATIONAL LIMITED","industry":"Software & Services","dateListed":"2016-06-09","marketCap":11946698,"xid":"350856611","priceChangeFiveDayPercent":0,"isRecentListing":false},{"symbol":"92E","displayName":"92 ENERGY LIMITED","industry":"Energy","dateListed":"2021-04-15","marketCap":40116694,"xid":"648306270","priceChangeFiveDayPercent":9.278350515463925,"isRecentListing":false},{"symbol":"99L","displayName":"99 LOYALTY LIMITED.","industry":"Software & Services","dateListed":"2013-10-08","marketCap":27832386,"xid":"592135903","priceChangeFiveDayPercent":-16.66666666666666,"isRecentListing":false},{"symbol":"ACB","displayName":"A-CAP ENERGY LIMITED","industry":"Energy","dateListed":"2006-05-19","marketCap":183856973,"xid":"4721927","priceChangeFiveDayPercent":-3.3333333333333366,"isRecentListing":false},{"symbol":"AYI","displayName":"A1 INVESTMENTS & RESOURCES LTD","industry":"Diversified Financials","dateListed":"2007-10-02","marketCap":16421946,"xid":"633104981","priceChangeFiveDayPercent":0,"isRecentListing":false},{"symbol":"A2B","displayName":"A2B AUSTRALIA LIMITED","industry":"Transportation","dateListed":"1999-12-14","marketCap":143312513,"xid":"69318","priceChangeFiveDayPercent":-2.5423728813559157,"isRecentListing":false},{"symbol":"ABP","displayName":"ABACUS PROPERTY GROUP","industry":"Real Estate","dateListed":"2002-11-14","marketCap":2878103957,"xid":"37039","priceChangeFiveDayPercent":2.359882005899707,"isRecentListing":false}]'

// const getJson = (url: string) => {
//   return request
//     .get(url)
//     .accept('application/json')
//     .ok(res => res.status < 500) // regard any HTTP status code < 500 as success
//     .then(res => {
//       return res.text
//     })
//     .catch(error => {
//       return new Error(`${error}`)
//     })
// }

async function getJson(url: string): Promise<string> {
  return request
    .get(url) // get total security count
    .accept('application/json')
    .ok(res => res.status < 500) // regard any HTTP status code < 500 as success
    .then(res => {
      return res.text
    })
}

async function getCompDir() {
  function getCompDirUrl(secCount: number): string {
    return (process.env.ASX_API_URL_COMP_DIR_PREFIX as string)
      + secCount
      + (process.env.ASX_API_URL_COMP_DIR_SUFFIX as string)
  }

  const oneSecData = await getJson(getCompDirUrl(1))

  if (oneSecData) {
    const allSecCount = JSON.parse(oneSecData)["data"]["count"]
    const allSecData = await getJson(getCompDirUrl(allSecCount))

    if (allSecData) {
      return Promise.resolve<compDir>(JSON.parse(allSecData)["data"]["items"])
    }

  // if (!(oneSecData instanceof Error)) {
  //   const allSecCount = JSON.parse(oneSecData)["data"]["count"]
  //   const allSecData = await getJson(getCompDirUrl(allSecCount))

  //   if (!(allSecData instanceof Error)) {
  //     return Promise.resolve<compDir>(JSON.parse(allSecData)["data"]["items"])
  //   } else {
  //     // console.error("Error in retrieving security count from ASX company directory")
  //     return Promise.reject<Error>(new Error('Error in retrieving security count from ASX company directory'))
  //   }
  // } else {
  //   // console.error("Error in retrieving data from ASX company directory")
  //   return Promise.reject<Error>(new Error('Error in retrieving data from ASX company directory'))
  // }
  }
}

async function createAsxFiles() {
  // const compDirData = await getCompDir()
  const compDirData: compDir = JSON.parse(str2)
  if (compDirData) {
  //if (!(compDirData instanceof Error)) {
    // let secAllData: compDir = JSON.parse(JSON.stringify(compDirData)) // deep copy, an independent replica of compDirData

    let secPerIndustryData: compDir[] = [] // an array of array, so not just compDir but compDir[]
    let secAllData: Object[] = []
    // let secAllData: secDataType[] = []

    // take out only unique industry names and sort them
    const industryList = Array.from(new Set(compDirData.map((sec) => sec.industry))).sort()
    const symbolList = compDirData.map((secOrig) => secOrig.symbol)

    // Once all the sec data gets merged it's hard to separate them into industries, as ALL the object porperties need to be mapped
    // 1. Sparate secs into their industries
    // 2. Fetch extra data from header and keystats
    // 3. Append them to the industryList
    // 4. Pop them into a newly created array, secAllData, keeping the same order
    industryList.forEach((industryName) => {
      // loop though each industry name, filter all the companies by it, and pop them into an array
      secPerIndustryData.push(compDirData.filter((sec) => { return sec.industry === industryName }))
    })

    // .forEach loop is SYNCHRONOUS, so use the old-style 'for' loop
    // NOT: secPerIndustryData.forEach(async (industry, industryIdx) => {
    for (let industryIdx in secPerIndustryData) {
      let secListPerIndustry: Object[] = []
       
      for (let secCompDir of secPerIndustryData[industryIdx]) {
        const url = process.env.ASX_API_URL_COMP_PREFIX + secCompDir.symbol   
        let mergedSecData: Object = secCompDir

        const res = await Promise.allSettled([getJson(url + process.env.ASX_API_URL_COMP_HEADER_SUFFIX),
                            getJson(url + process.env.ASX_API_URL_COMP_KEY_STATISTICS_SUFFIX)])

        res.forEach(result => {
          if (result.status == "fulfilled") {
          // merge into the original data
          // somehow only status propery is available to result, so use index assessor i.e. ['value']
          mergedSecData = Object.assign(mergedSecData, JSON.parse(result["value"])["data"])
         }
        })

        secListPerIndustry.push(mergedSecData)

        secAllData[symbolList.indexOf(secCompDir.symbol)] = mergedSecData
      }

      saveAsxJsonFile(secListPerIndustry, industryList[industryIdx].split(' ').join('-').toLowerCase() + ".json")
    }

    // FOREACH IS SYNCHRONOUS!!!
    // secPerIndustryData.forEach(async (industry, industryIdx) => {
    //   let secListPerIndustry: Object[] = []

    //   industry.forEach(async (secCompDir) => {
    //     const url = process.env.ASX_API_URL_COMP_PREFIX + secCompDir.symbol    
    //     let mergedSecData: Object = secCompDir

    //     const res = await Promise.allSettled([getJson(url + process.env.ASX_API_URL_COMP_HEADER_SUFFIX),
    //                         getJson(url + process.env.ASX_API_URL_COMP_KEY_STATISTICS_SUFFIX)])

    //     res.forEach(result => {
    //       if (result.status == "fulfilled") {
    //       // merge into the original data
    //       // somehow only status propery is available to result, so use index assessor i.e. ['value']
    //       mergedSecData = Object.assign(mergedSecData, JSON.parse(result["value"])["data"])
    //      }
    //     })

    //     secListPerIndustry.push(mergedSecData)

    //     secAllData[symbolList.indexOf(secCompDir.symbol)] = mergedSecData
    //   })

    //   await saveAsxJsonFile(secListPerIndustry, industryList[industryIdx].split(' ').join('-').toLowerCase() + ".json")
    // })


      // const promiseHeaders: Promise<string>[] =[]
      // const promisekeyStats: Promise<string>[] = []

      // promiseHeaders.push(getJson(url + process.env.ASX_API_URL_COMP_HEADER_SUFFIX))
      // promisekeyStats.push(getJson(url + process.env.ASX_API_URL_COMP_KEY_STATISTICS_SUFFIX))

      // const headerRes = await Promise.allSettled(promiseHeaders)
      // const keyStatsRes = await Promise.allSettled(promiseHeaders)

        // function getSecData(sec: PromiseSettledResult<string>): Object | undefined {
        //   if ((JSON.parse((sec as unknown) as string))["status"] == "fullfilled") {
        //     return (JSON.parse((sec as unknown) as string)["value"])["data"]
        //   } else {
        //     return undefined
        //   }
        // }

    // let secPerIndustryData: compDir[] = [] // an array of array, so not just compDir but compDir[]

        // symbolList.forEach((sec) => {
    //   const url = process.env.ASX_API_URL_COMP_PREFIX + sec    
     
    //   promiseHeaders.push(getJson(url + process.env.ASX_API_URL_COMP_HEADER_SUFFIX))
    //   promisekeyStats.push(getJson(url + process.env.ASX_API_URL_COMP_KEY_STATISTICS_SUFFIX))

    // industryList.forEach((industryName) => {
    //   // loop though each industry name, filter all the companies by it, and pop them into an array
    //   secPerIndustryData.push(compDirData.filter((sec) => { return sec.industry === industryName }))
    // })

    // secPerIndustryData.forEach((industry) => {
    //   let secListPerIndustry: Object[] = []

    //   async function getExtraData(industry: compDir): Promise<[Object, string]> {
    //     let mergedDataPerSec: [Object, string] = ['', '']

    //     industry.forEach((secCompDir) => {
    //       const url = process.env.ASX_API_URL_COMP_PREFIX
    //                   + secCompDir.symbol
 
    //       const extraSecData = await Promise.allSettled([
    //                               getJson(url + process.env.ASX_API_URL_COMP_HEADER_SUFFIX),
    //                               getJson(url + process.env.ASX_API_URL_COMP_KEY_STATISTICS_SUFFIX)])
 
    //       // if (!(extraSecData instanceof Error)) {
    //       //   // [
    //       //   //   {status: "fulfilled", value: 33},
    //       //   //   {status: "rejected",  reason: Error: an error}
    //       //   // ]
    //       extraSecData.forEach((result) => {
    //         if (result.status == "fulfilled") {
    //           // merge into the original data
    //           // somehow only status propery is available to result, so use index assessor i.e. ['value']
    //           mergedDataPerSec = [Object.assign(secCompDir, JSON.parse((result["value"] as string))["data"]), secCompDir.symbol]
    //         }
    //       })
    //     })

    //     return mergedDataPerSec
    //   }


        // Object properties are listed (upon merging):
        // - All integer index keys (stuff like "1123", "55", etc) in ascending numeric order.
        // - All string keys which are not integer indices, in order of creation (oldest-first). <- MY CASE
        // - All symbol keys, in order of creation (oldest-first).

        // mergedDataPerSec = Object.assign(secCompDir,
        //                                 (!(header instanceof Error))? JSON.parse(header)["data"]: '',
        //                                 (!(keyStats instanceof Error))? JSON.parse(keyStats)["data"]: '')

        // if ((!(header instanceof Error)) && (!(keyStats instanceof Error))) {
        //   mergedDataPerSec = Object.assign(secCompDir, JSON.parse(header), JSON.parse(keyStats))
        //   // mergedData = { ...secCompDir, ...JSON.parse(header), ...JSON.parse(keyStats)}
        // } else if (!(header instanceof Error)) {
        //   mergedDataPerSec = Object.assign(secCompDir, JSON.parse(header))
        // } else if (!(keyStats instanceof Error)) {
        //   mergedDataPerSec = Object.assign(secCompDir, JSON.parse(keyStats))
        // } else {
        //   mergedDataPerSec = secCompDir
        // }

        // secPerIndustryData[industryIdx][secIdx] = mergedData
        // secListPerIndustry.push(mergedDataPerSec)
        // This does NOT give error... why?
        // type res = {
        //   status: string
        //   value?: undefined
        //   reason?: undefined
        // }
   
    saveAsxJsonFile(compDirData, (process.env.ASX_COMP_DIR_DATA_FILE_NAME as string))
    saveAsxJsonFile(secAllData, (process.env.ASX_COMP_ALL_DATA_FILE_NAME as string))
  } else {
    console.error("No data")
  }
}

async function saveAsxJsonFile(jsonData: Object[], filename: string) {
  await writeFile(JSON.stringify(jsonData, null, 2),
            (process.env.DATA_DIR as string),
            (process.env.ASX_DATA_FILE_NAME_PREFIX as string) + filename)
}

createAsxFiles()

// GLOBAL FUNCTION
async function writeFile(jsonStr: string, dirName: string, fileName: string) {
  try {
    dirName = (process.env.GITHUB_ACTIONS_ROOT_DIR || process.cwd()) + dirName
    // On a local machine this 'undefined' process.env.GITHUB_ACTIONS_ROOT_DIR gives false, while it prints on Github Actions.
    // No need to set up a secret on Github Actions.

    if (!fs.existsSync(dirName)) { fs.mkdirSync(dirName) }

    if (jsonStr.length) {
      // overwrite the existing file by default
      const fullName = dirName + fileName

      fs.writeFile(fullName, jsonStr, (err: any) => {
        if (err) {
          throw new Error(`Error in saving ${fullName}`)
        }
      })
    } else {
      throw new Error(`Empty data from ${jsonStr}}`)
    }
  } catch (err) {
    console.error(err)
  }
}