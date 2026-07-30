const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer");

const ROOT = path.join(process.cwd(), "uploads");
const CONSENSI = path.join(ROOT, "consensi");

async function generaPdfConsenso({

    paziente,

    template,

    html,

    firmaPaziente,

    firmaOperatore,

    consensoId

}) {

    await fs.ensureDir(CONSENSI);

    const fileName =
        `CONS-${String(consensoId).padStart(6,"0")}.pdf`;

    const filePath = path.join(CONSENSI,fileName);

    const pagina = `

<!DOCTYPE html>

<html lang="it">

<head>

<meta charset="utf-8"/>

<style>

body{

font-family:Arial,Helvetica,sans-serif;

padding:30px;

font-size:14px;

line-height:1.5;

color:#222;

}

img{

max-width:250px;

}

hr{

margin-top:30px;

margin-bottom:30px;

}

</style>

</head>

<body>

${html}

<hr>

<table width="100%">

<tr>

<td>

<strong>Firma Paziente</strong>

<br><br>

<img src="${firmaPaziente}" />

</td>

<td>

<strong>Firma Operatore</strong>

<br><br>

<img src="${firmaOperatore}" />

</td>

</tr>

</table>

</body>

</html>

`;

    const browser = await puppeteer.launch({

        headless:true,

        args:["--no-sandbox"]

    });

    const page = await browser.newPage();

    await page.setContent(pagina,{

        waitUntil:"networkidle0"

    });

    await page.pdf({

        path:filePath,

        format:"A4",

        printBackground:true,

        margin:{

            top:"20mm",

            bottom:"20mm",

            left:"15mm",

            right:"15mm"

        }

    });

    await browser.close();

    return{

        fileName,

        filePath

    };

}

module.exports={

    generaPdfConsenso

};