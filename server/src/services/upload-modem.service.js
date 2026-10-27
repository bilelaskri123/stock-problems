const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { poolModemRadius, poolModemDark } = require('../config/db')


async function insertModemsInDark(query) {
    await poolModemDark.query(query);
}


async function insertModemsInRadius(query) {
    await poolModemRadius.query(query);
}

function parseGponJson(jsonData) {
    const listSN = jsonData.flat();
    let sqlQuery = 'INSERT INTO modem (Mac, SN) VALUES '
    for (const sn of listSN) {
        const item = `('${sn}', '${sn}'), `
        sqlQuery = sqlQuery.concat(item);
    }
    sqlQuery = sqlQuery.slice(0, -2).concat(';');
    return sqlQuery;
}

function parseXdslJson(jsonData) {
    let sqlQuery = 'INSERT INTO modem (Mac, SN) VALUES '
    for (const element of jsonData) {
        const item = `('${element[0]}', '${element[1]}'), `;
        sqlQuery = sqlQuery.concat(item);
    }
    sqlQuery = sqlQuery.slice(0, -2).concat(';');
    return sqlQuery;
}

async function uploadRadiusModems(type, filename) {
    try {
        const filePath = path.join(__dirname, `../../uploads/${filename}`);
        // Read the excel file
        const workbook = XLSX.readFile(filePath);

        // target the first sheet name
        const sheetName = workbook.SheetNames[0];

        // Get the worksheet data
        const worksheet = workbook.Sheets[sheetName];

        // convert the worksheet to a json array of objects
        // this automatically assumes the first row contains headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(jsonData[0].length)

        let sqlQuery;
        if (type === 'GPON' && jsonData[0].length === 1) {
            console.log('gpon');
            sqlQuery = parseGponJson(jsonData);
        } else if (type === 'XDSL' && jsonData[0].length === 2) {
            console.log('xdsl');
            sqlQuery = parseXdslJson(jsonData);
        } else {
            throw new Error('Invalid Excel file');
        }
        console.log(sqlQuery);
        const [result1, result2] = await Promise.all([insertModemsInDark(sqlQuery), insertModemsInRadius(sqlQuery)]);
        console.log(result1, result2);
    } catch (error) {
        console.log(error);
        throw error;
    }
}


module.exports = {
    uploadRadiusModems
}