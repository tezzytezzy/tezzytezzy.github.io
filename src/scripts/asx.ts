import { config } from 'dotenv'
import request from 'superagent'

import fs from 'fs'

config()

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

async function getJson(url: string): Promise<string> {
  // Try http://httpstat.us/200 to test out different status codes
  return request
    .get(url)
    .accept('application/json')
    .ok(res => res.status < 500) // Any HTTP status codes < 500 as success
    .then(res => {
      return res.text
    })
}

async function getCompDir() {
  function getCompDirUrl(secCount: number): string {
    return "https://asx.api.markitdigital.com/asx-research/1.0/companies/directory?page=0&itemsPerPage="
      + secCount
      + "&order=ascending&orderBy=companyName&includeFilterOptions=true&recentListingsOnly=false"
  }

  // Only to get total security count
  const oneSecData = await getJson(getCompDirUrl(1))

  if (oneSecData) {
    const allSecCount = JSON.parse(oneSecData)["data"]["count"]
    const allSecData = await getJson(getCompDirUrl(allSecCount))

    if (allSecData) {
      return Promise.resolve<compDir>(JSON.parse(allSecData)["data"]["items"])
    }
  }
}

async function createAsxFiles() {
  const compDirData = await getCompDir()
  // const compDirData: compDir = JSON.parse(str2)
  if (compDirData) {
    let secPerIndustryData: compDir[] = [] // An array of array, so not just compDir but compDir[]
    let secAllData: Object[] = []

    // Take out only unique industry names and sort them
    const industryList = Array.from(new Set(compDirData.map((sec) => sec.industry))).sort()
    const symbolList = compDirData.map((secOrig) => secOrig.symbol)

    saveAsxJsonFile(compDirData, "comp-dir.json")

    // Once all the sec data gets merged it's hard to separate them into industries, as ALL the object porperties need to be mapped
    // 1. Sparate secs into their industries
    // 2. Fetch extra data from header and keystats
    // 3. Append them to the industryList
    // 4. Pop them into a newly created array, secAllData, keeping the same order
    industryList.forEach((industryName) => {
      // Loop though each industry name, filter all the companies by it, and pop them into an array
      secPerIndustryData.push(compDirData.filter((sec) => { return sec.industry === industryName }))
    })

    // .forEach loop is SYNCHRONOUS, so use the old-style 'for' loop
    // NOT: secPerIndustryData.forEach(async (industry, industryIdx) => {
    for (let industryIdx in secPerIndustryData) {
      let secListPerIndustry: Object[] = []

      for (let secCompDir of secPerIndustryData[industryIdx]) {
        const url = "https://asx.api.markitdigital.com/asx-research/1.0/companies/" + secCompDir.symbol
        let mergedSecData: Object = secCompDir

        console.log(secCompDir.symbol)

        const res = await Promise.allSettled([getJson(url + "/header"),
        getJson(url + "/key-statistics")])

        res.forEach(result => {
          if (result.status == "fulfilled") {
            // Merge into the original data
            // Somehow only status property is available to 'result', so use index assessor i.e. ['value']
            mergedSecData = Object.assign(mergedSecData, JSON.parse(result["value"])["data"])
          }
        })

        secListPerIndustry.push(mergedSecData)

        secAllData[symbolList.indexOf(secCompDir.symbol)] = mergedSecData
      }

      saveAsxJsonFile(secListPerIndustry, industryList[industryIdx].split(' ').join('-').toLowerCase() + ".json")
    }

    saveAsxJsonFile(secAllData, "comp-all-data.json")
  } else {
    console.error("No data")
  }
}

async function saveAsxJsonFile(jsonData: Object[], filename: string) {
  await writeFile(JSON.stringify(jsonData, null, 2),
    "/dist/data/",
    "asx-" + filename)
}

async function writeFile(jsonStr: string, dirName: string, fileName: string) {
  try {
    dirName = (process.env.GITHUB_ACTIONS_ROOT_DIR || process.cwd()) + dirName
    // On a local machine this 'undefined' process.env.GITHUB_ACTIONS_ROOT_DIR gives false
    // This way, no need to set up a secret on Github Actions.

    if (!fs.existsSync(dirName)) { fs.mkdirSync(dirName) }

    if (jsonStr.length) {
      // Overwrite the existing file by default
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

createAsxFiles()