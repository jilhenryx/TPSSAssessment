testData1 = {
    "ID": 1308,
    "Amount": 12580,
    "Currency": "NGN",
    "CustomerEmail": "anon8@customers.io",
    "SplitInfo": [
      {
        "SplitType": "FLAT",
        "SplitValue": 45,
        "SplitEntityId": "LNPYACC0019"
      },
      {
        "SplitType": "RATIO",
        "SplitValue": 3,
        "SplitEntityId": "LNPYACC0011"
      },
      {
        "SplitType": "PERCENTAGE",
        "SplitValue": 3,
        "SplitEntityId": "LNPYACC0015"
      }
    ]
  }

testData2 = {
    "ID": 13092,
    "Amount": 10000,
    "Currency": "NGN",
    "CustomerEmail": "anon8@customers.io",
    "SplitInfo": [
        {
            "SplitType": "FLAT",
            "SplitValue": 450,
            "SplitEntityId": "LNPYACC0019"
        },
        {
            "SplitType": "RATIO",
            "SplitValue": 3,
            "SplitEntityId": "LNPYACC0011"
        },
        {
            "SplitType": "PERCENTAGE",
            "SplitValue": 3,
            "SplitEntityId": "LNPYACC0015"
        },
        {
            "SplitType": "RATIO",
            "SplitValue": 2,
            "SplitEntityId": "LNPYACC0016"
        },
        {
            "SplitType": "FLAT",
            "SplitValue": 2450,
            "SplitEntityId": "LNPYACC0029"
        },
        {
            "SplitType": "PERCENTAGE",
            "SplitValue": 10,
            "SplitEntityId": "LNPYACC0215"
        },
        {
            "SplitType": "RATIO",
            "SplitValue": 2,
            "SplitEntityId": "LNPYACC0016"
        },
        {
            "SplitType": "FLAT",
            "SplitValue": 2450,
            "SplitEntityId": "LNPYACC0029"
        },
        {
            "SplitType": "PERCENTAGE",
            "SplitValue": 10,
            "SplitEntityId": "LNPYACC0215"
        }
    ]
}

testData1Response = {
    "ID": 1308,
    "Balance": 0,
    "SplitBreakdown": [
        {
            "SplitEntityId": "LNPYACC0019",
            "Amount": 45
        },
        {
            "SplitEntityId": "LNPYACC0011",
            "Amount": 12158.95
        },
        {
            "SplitEntityId": "LNPYACC0015",
            "Amount": 376.05
        }
    ]
}

testData2Response = {
    "ID": 13092,
    "Balance": 4.547473508864641e-13,
    "SplitBreakdown": [
        {
            "SplitEntityId": "LNPYACC0019",
            "Amount": 450
        },
        {
            "SplitEntityId": "LNPYACC0011",
            "Amount": 1565.7878571428569
        },
        {
            "SplitEntityId": "LNPYACC0015",
            "Amount": 139.5
        },
        {
            "SplitEntityId": "LNPYACC0016",
            "Amount": 1043.8585714285712
        },
        {
            "SplitEntityId": "LNPYACC0029",
            "Amount": 2450
        },
        {
            "SplitEntityId": "LNPYACC0215",
            "Amount": 451.05
        },
        {
            "SplitEntityId": "LNPYACC0016",
            "Amount": 1043.8585714285712
        },
        {
            "SplitEntityId": "LNPYACC0029",
            "Amount": 2450
        },
        {
            "SplitEntityId": "LNPYACC0215",
            "Amount": 405.945
        }
    ]

}

exports.testData = [testData1, testData2]; 
exports.testDataResponse = [testData1Response, testData2Response]; 