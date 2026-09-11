const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1366,height:900}});
 await page.goto(pathToFileURL(path.resolve('index.html')).href);
 const active=()=>page.locator('.workbench > .step:visible').getAttribute('id');
 for(const id of ['guide','game','class','theme','result']){
  assert.equal(await active(),id+'-card');
  assert.equal(await page.locator('.workbench > .step:visible').count(),1);
  assert.equal(await page.locator('.card-nav [aria-current=step]').getAttribute('href'),'#'+id+'-card');
  if(id==='game')await page.locator('#featured [data-game=race]').click();
  if(id==='class'){
   await page.locator('#players [data-value="5"]').click();
   await page.locator('summary').click();
   await page.locator('#goal').fill('분모가 같은 분수 비교');
  }
  if(id==='theme')await page.locator('#themes [data-value=forest]').click();
  await page.screenshot({path:path.resolve('docs/verification/wizard-'+id+'.png'),fullPage:true});
  if(id!=='result')await page.locator('#step-next').click();
 }
 assert(await page.locator('#step-next').isHidden());
 const output=await page.evaluate(()=>generator.getOutput());
 await page.locator('#step-prev').click();
 assert.equal(await active(),'theme-card');
 await page.locator('#step-prev').click();
 assert.equal(await page.locator('#goal').inputValue(),'분모가 같은 분수 비교');
 assert.equal(await page.locator('#players [aria-pressed=true]').textContent(),'5명');
 await page.goBack();
 assert.equal(await active(),'theme-card');
 await page.goForward();
 assert.equal(await active(),'class-card');
 assert.equal(await page.evaluate(()=>generator.getOutput()),output);
 await page.setViewportSize({width:390,height:844});
 await page.locator('#step-next').click();
 await page.screenshot({path:path.resolve('docs/verification/wizard-mobile.png'),fullPage:true});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await browser.close();
 console.log('PASS: sequential steps, single visible card, current indicator, previous/next, preserved choices, browser history and mobile layout');
})().catch(e=>{console.error(e);process.exit(1)});
