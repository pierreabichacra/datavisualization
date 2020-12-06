import pandas as pd
import json

data = pd.read_csv("GENDER.csv")

arr = []

male = 0
countOfMale = 0
female = 0
countOfFemale = 0
preferNotToSay = 0
countOfPrefer = 0
other = 0
countOfOther = 0

for i in data.Gender:
    if i == 1:
        male += 1
        countOfMale += 1
    if i == 2:
        female += 1
        countOfFemale += 1
    if i == 3:
        preferNotToSay += 1
        countOfPrefer += 1
    if i == 4:
        other += 1
        countOfOther += 1

male = round((male/len(data)) * 100, 2)
female = round((female/len(data)) * 100, 2)
preferNotToSay = round((preferNotToSay/len(data)) * 100, 2)
other = round((other/len(data)) * 100, 2)

nine_to_twelve = 0
countOfNine = 0
thirteen_to_nineteen = 0
countOfThirteen = 0
twenty_to_twentynine = 0
countOfTwenty = 0
thirty_to_thirtynine = 0
countOfThirty = 0
forty_to_fortynine = 0
countOfForty = 0
above_fifty = 0
countOfFifty = 0
other_age = 0
countOfOtherAge = 0

for i in data.Age:
    if i == "#NULL!":
        other_age += 1
        countOfOtherAge += 1
    else:
        if int(i) >= 9 and int(i) <= 12:
            nine_to_twelve += 1
            countOfNine += 1
        if int(i) >= 13 and int(i) <= 19:
            thirteen_to_nineteen += 1
            countOfThirteen += 1
        if int(i) >= 20 and int(i) <= 29:
            twenty_to_twentynine += 1
            countOfTwenty += 1
        if int(i) >= 30 and int(i) <= 39:
            thirty_to_thirtynine += 1
            countOfThirty += 1
        if int(i) >= 40 and int(i) <= 49:
            forty_to_fortynine += 1
            countOfForty += 1
        if int(i) >= 50:
            above_fifty += 1
            countOfFifty += 1

nine_to_twelve = round((nine_to_twelve/len(data)) * 100, 2)
thirteen_to_nineteen = round((thirteen_to_nineteen/len(data)) * 100, 2)
twenty_to_twentynine = round((twenty_to_twentynine/len(data)) * 100, 2)
thirty_to_thirtynine = round((thirty_to_thirtynine/len(data)) * 100, 2)
forty_to_fortynine = round((forty_to_fortynine/len(data)) * 100, 2)
above_fifty = round((above_fifty/len(data)) * 100, 2)
other_age = round((other_age/len(data)) * 100, 2)

eastern = 0
countOfEastern = 0
western = 0
countOfWestern = 0
other_regions = 0
countOfOtherRegions = 0

for i in data.Eastern_Western:
    if i == "#NULL!":
        other_regions += 1
        countOfOtherRegions += 1
    if i == "1":
        eastern += 1
        countOfEastern += 1
    if i == "2":
        western += 1
        countOfWestern += 1

other_regions = round((other_regions/len(data)) * 100, 2)
eastern = round((eastern/len(data)) * 100, 2)
western = round((western/len(data)) * 100, 2)


arr = {"Gender": [
    {"value": "male", "count": male, "numberOfValues": countOfMale},
    {"value": "female", "count": female, "numberOfValues": countOfFemale},
    {"value": "other", "count": other, "numberOfValues": countOfOther},
    {"value": "prefer not to say", "count": preferNotToSay, "numberOfValues": countOfPrefer}
    ],
    "Age": [
        {"value": "9-12", "count": nine_to_twelve, "numberOfValues": countOfNine},
        {"value": "13-19", "count": thirteen_to_nineteen, "numberOfValues": countOfThirteen},
        {"value": "20-29", "count": twenty_to_twentynine, "numberOfValues": countOfTwenty},
        {"value": "30-39", "count": thirty_to_thirtynine, "numberOfValues": countOfThirty},
        {"value": "40-49", "count": forty_to_fortynine, "numberOfValues": countOfForty},
        {"value": ">50", "count": above_fifty, "numberOfValues": countOfFifty},
        {"value": "Not Specified", "count": other_age, "numberOfValues": countOfOtherAge}
    ],
    "Region": [
        {"value": "eastern", "count": eastern, "numberOfValues": countOfEastern},
        {"value": "western", "count": western, "numberOfValues": countOfWestern},
        {"value": "Not specified", "count": other_regions, "numberOfValues": countOfOtherRegions}
    ],
    "TotalPeopleSurveyed": len(data)}

with open("genderProcessed.json", "w") as f:
    json.dump(arr, f)


