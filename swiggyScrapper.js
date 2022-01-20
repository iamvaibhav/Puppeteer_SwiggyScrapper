/* Puppeteer */
const puppeteer = require("puppeteer");

/* Getting all the Restaurant Details */
async function getDishDetail(URL, page) {

    //  URL of  link 
    await page.goto(URL);

    const KFCdishes = await page.evaluate(() => {

        /*Restaurant Name */
        const RestName = document.body.querySelector(".OEfxz ._3aqeL").innerText;

        /* Restaurant Address */
        const restAddress = document.body.querySelector("._1BpLF .Gf2NS").innerText;

        /* Special Offers */
        const SpecialOffers = document.body.querySelectorAll(".DM5zR ._3lvLZ");
        const SpecialOfferDetail = [];

        /* Loop for the Offers of the Restaurant */
        SpecialOffers.forEach((offer) => {
            SpecialOfferDetail.push(offer.innerText);
        });

        const dish = document.querySelectorAll(".styles_detailsContainer__3VbXy");

        /* all the dishes detail in the array */
        let dishArr = [];

        // logic for getting the Dish Info
        dish.forEach((dishTag) => {
            const dishName = dishTag.querySelector(".styles_itemName__2Aoj9 h3");
            const dishdetail = dishTag.querySelectorAll(".styles_itemPortionContainer__PE0SY span");
            const dishPriceInfo = dishdetail[0];
            const dishPrice = dishPriceInfo.querySelector(".rupee");

            try {
                // Condition if the Dishes having offer

                /*  discounts to all orders */
                const discountOf = (parseInt(SpecialOfferDetail[0].slice(0, 2)));
                /* Discount  Price of all the Dishes */
                const getDiscount = parseFloat(dishPrice.innerText) - (parseFloat(dishPrice.innerText) * discountOf / 100);

                /* DishDetailS */
                if (dishPrice.innerText < 150) {

                    /* pushing the dishesDetail in the Array */
                    dishArr.push({
                        DishName: dishName.innerText,
                        DishPrice: dishPrice.innerText,
                        DiscountOffer: discountOf + "% Off",
                        DiscountPrice: parseFloat(getDiscount.toFixed(2)),
                    });
                }


            } 
            catch (error) {

                /* DishDetails */
                if (dishPrice.innerText < 150) {
                    dishArr.push({
                        DishName: dishName.innerText,
                        DishPrice: dishPrice.innerText,

                    });
                }
            }


        });

        /* Condition for the Sabse Sasti Dish */
        let lowest = Number.POSITIVE_INFINITY
        var MinPriceDish;
        var lowestdishIndex;

        for (let i = dishArr.length - 1; i >= 0; i--) {
            var MinPriceDish = parseFloat(dishArr[i].DishPrice);

            if (MinPriceDish < lowest) {
                lowest = MinPriceDish;
                lowestdishIndex = dishArr[i]
            }

        }
                /*   -----------    */ 

        return {
            Restaurant: "*******----------------*****-----Restaurant-----*****---------------------******",
            RestaurantName: RestName,
            ADDRESS: restAddress,
            specialOffer: SpecialOfferDetail,
            // Restaurant_Dishes: dishArr
            SastiDish: lowestdishIndex,

        }

    });

    // Output of the  KFC dishes 
    console.log(KFCdishes);

    // Closing the browser
    // await browser.close();

}

async function main() {


    // Launch the browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();


    // Tracking for the Nagpur's Location
    await page.goto("https://www.swiggy.com/");
    await page.type("#location", "Nagpur, Maharashtra, India");

    /* Waiting for the restaurant */
    await page.waitForSelector("div[tabindex='2']");
    await page.click("div[tabindex='2']");

    // Code for printing the  particular the links of all the Restaurants
    await page.waitForSelector(".MZy1T ._3XX_A a");
    const allLinks = await page.$$eval('.MZy1T ._3XX_A a', allA => allA.map(a => a.href));
    // console.log(allLinks);

    // getting the dishDetails with  their Price and Name  less than 150.
    const scrapedDishDetail = [];

    /* Printing the DishDeails */
    for (let link of allLinks) {
        const data = await getDishDetail(link, page);
        scrapedDishDetail.push(data);

    }

    // Output for the dishes Details for particular Restaurants
    console.log(scrapedDishDetail);

    // Close the Browser
    await browser.close();
}

// Calling the function
main();

