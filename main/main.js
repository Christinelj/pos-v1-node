module.exports = function printInventory(inputs) {
    function loadAllItems() {
        return [
            {
                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00
            },
            {
                barcode: 'ITEM000004',
                name: '电池',
                unit: '个',
                price: 2.00
            },
            {
                barcode: 'ITEM000005',
                name: '方便面',
                unit: '袋',
                price: 4.50
            }
        ];
    }

    function loadPromotions() {
        return [
            {
                type: 'BUY_TWO_GET_ONE_FREE',
                barcodes: [
                    'ITEM000000',
                    'ITEM000001',
                    'ITEM000005'
                ]
            }
        ];
    }

    function countNumber(inputs) {
        var countNumberResult = [];
        var arr = [];
        for (var i = 0; i < inputs.length; i++) {
            if (!(inputs[i].indexOf("-") === -1)) {
                var symbolHyphenSplite = []; var number = 0;
                symbolHyphenSplite = inputs[i].split("-");
                inputs[i] = symbolHyphenSplite[0];
                number = parseInt(symbolHyphenSplite[1]);
                if (!arr[inputs[i]]) {
                    arr[inputs[i]] = {};
                    arr[inputs[i]].barcode = inputs[i];
                    arr[inputs[i]].count = number;
                } else {
                    arr[inputs[i]].count = arr[inputs[i]].count + number;
                }
            }
            else {
                if (!arr[inputs[i]]) {
                    arr[inputs[i]] = {};
                    arr[inputs[i]].barcode = inputs[i];
                    arr[inputs[i]].count = 1;
                } else {
                    arr[inputs[i]].count++
                }
            }
        }
        for (var i in arr) {
            countNumberResult.push(arr[i])
        }
        return countNumberResult;
    }

    function standardizeInput(inputs) {
        var standardItem = [];
        var allItems = loadAllItems();
        var countNumberResult = countNumber(inputs);
        for (var i = 0; i < countNumberResult.length; i++) {
            for (var j = 0; j < allItems.length; j++) {
                if (countNumberResult[i].barcode === allItems[j].barcode) {
                    countNumberResult[i].name = allItems[j].name;
                    countNumberResult[i].unit = allItems[j].unit;
                    countNumberResult[i].price = allItems[j].price;
                    standardItem.push(countNumberResult[i]);
                    break;
                }
            }
        }
        return standardItem;
    }

    function Promotion(standardInputItem) {
        var Promotions = loadPromotions();
        var discountItem = [];
        for (var i = 0; i < standardInputItem.length; i++) {
            for (var j = 0; j < Promotions[0].barcodes.length; j++) {
                if (standardInputItem[i].barcode === Promotions[0].barcodes[j]) {
                    if (standardInputItem[i].count > 2) {
                        standardInputItem[i].discountNumber = 1
                        discountItem.push(standardInputItem[i]);
                    }
                }
            }
        }
        return discountItem;
    }

    function calculateSubTotal(standardInputItem) {
        var discountItem = Promotion(standardInputItem);
        var shoppingListCalculateSubTotal = [];
        for (var i = 0; i < standardInputItem.length; i++) {
            var dup = false;
            for (var j = 0; j < discountItem.length; j++) {
                if (standardInputItem[i].barcode === discountItem[j].barcode) {
                    dup = true;
                    standardInputItem[i].afterDiscountSubTotal = (standardInputItem[i].count - discountItem[j].discountNumber) * standardInputItem[i].price;
                    shoppingListCalculateSubTotal.push(standardInputItem[i]);
                    break;
                }
            }
            if (!dup) {
                standardInputItem[i].afterDiscountSubTotal = standardInputItem[i].count * standardInputItem[i].price;
                shoppingListCalculateSubTotal.push(standardInputItem[i]);
            }

        }
        return shoppingListCalculateSubTotal;
    }

    function printShoppingList(shoppingListCalculateSubTotal) {
        var shoppingList = '***<没钱赚商店>购物清单***\n';
        for (var i = 0; i < shoppingListCalculateSubTotal.length; i++) {
            shoppingList += '名称：' + shoppingListCalculateSubTotal[i].name + '，数量：'
                + shoppingListCalculateSubTotal[i].count + shoppingListCalculateSubTotal[i].unit + '，单价：' + shoppingListCalculateSubTotal[i].price.toFixed(2)
                + '(元)，小计：' + shoppingListCalculateSubTotal[i].afterDiscountSubTotal.toFixed(2) + '(元)\n'
        }
        return shoppingList;
    }

    function printPromotion(discountItem) {
        var shoppingPromotion = '----------------------\n' + '挥泪赠送商品：\n';
        for (var i = 0; i < discountItem.length; i++) {
            shoppingPromotion += '名称：' + discountItem[i].name + '，数量：' + discountItem[i].discountNumber
                + discountItem[i].unit + '\n'
        }
        return shoppingPromotion;
    }

    function calculateTotalPrice(shoppingListCalculateSubTotal) {
        var totalPrice = 0;
        for (var i = 0; i < shoppingListCalculateSubTotal.length; i++) {
            totalPrice += shoppingListCalculateSubTotal[i].afterDiscountSubTotal;
        }
        return totalPrice;
    }

    function calculateDiscountPrice(discountItem) {
        var savePrice = 0;
        for (var i = 0; i < discountItem.length; i++) {
            savePrice += discountItem[i].discountNumber * discountItem[i].price;
        }
        return savePrice;
    }

    var standardInputItem = standardizeInput(inputs);
    var shoppingListCalculateSubTotal = calculateSubTotal(standardInputItem);
    var discountItem = Promotion(standardInputItem);
    var totalPrice = calculateTotalPrice(shoppingListCalculateSubTotal);
    var savePrice = calculateDiscountPrice(discountItem);
    var printResult = printShoppingList(shoppingListCalculateSubTotal) + printPromotion(discountItem) + '----------------------\n'
        + '总计：' + totalPrice.toFixed(2) + '(元)\n' + '节省：' + savePrice.toFixed(2) + '(元)\n'
        + '**********************';
    console.log(printResult);
    return printResult;

};