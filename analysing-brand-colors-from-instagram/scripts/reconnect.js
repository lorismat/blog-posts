const fsLibrary  = require('fs')
const puppeteer = require('puppeteer');
const args = process.argv.slice(2);

try {
	if (args.length > 0) {
		console.log(args);
	}
	else {
		throw new Error("no hashtags");
	}
}
catch(e) {
	console.log(e);
}

const endpoint = "ws://127.0.0.1:61294/devtools/browser/aa93ecf6-cffa-4f0c-9434-0e23a9a74130"

const city = args[0];
const url = `https://www.instagram.com/${city}/`;

let links;


(async () => {

	const browser =  await puppeteer.connect({
		browserWSEndpoint: endpoint
	});

	const page = await browser.newPage();
	await page.goto(url);

	await page.waitForTimeout(1000);

	links = await page.$$eval('.KL4Bh img', elements => elements.map(el => el.src)
	)

	for (i = 0; i<60; i++) {
		await console.log(i);
		await page.mouse.wheel({ deltaY: 1000 });
		await page.waitForTimeout(1000);
		//links.push(await page.$$eval('.KL4Bh img', elements => elements.map(el => el.src)));
		links = links.concat(await page.$$eval('.KL4Bh img', elements => elements.map(el => el.src)));
	}

	await page.waitForTimeout(10000);

	await fsLibrary.writeFile(`links/${city}.txt`, links.toString(), (error) => { 
    // In case of a error throw err exception. 
    if (error) throw err; 
}) 

	await browser.disconnect();

})();
