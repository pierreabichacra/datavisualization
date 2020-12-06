import pandas as pd
import json

data = pd.read_json('locks_and_unlocks2.json')


d = {"lock": {}, "unlock": {}}
#
#
def changeMonths(month):
    if month.lower() == "jan":
        return "01"
    if month.lower() == "feb":
        return "02"
    if month.lower() == "mar":
        return "03"
    if month.lower() == "apr":
        return "04"
    if month.lower() == "may":
        return "05"
    if month.lower() == "jun":
        return "06"
    if month.lower() == "jul":
        return "07"
    if month.lower() == "aug":
        return "08"
    if month.lower() == "sep":
        return "09"
    if month.lower() == "oct":
        return "10"
    if month.lower() == "nov":
        return "11"
    if month.lower() == "dec":
        return "12"

for k, v in data.items():
    for k1, v1 in v.items():
        if k == "lock":
            splitted = k1.split("-")
            if splitted[1].lower() != "jan" and splitted[1].lower() != "feb" and splitted[1].lower() != "mar" and splitted[1].lower() != "apr" \
                    and splitted[1].lower() != "may" and splitted[1].lower() != "jun" and splitted[1].lower() != "jul" and splitted[1].lower() != "aug" \
                    and splitted[1].lower() != "sep" and splitted[1].lower() != "oct" and splitted[1].lower() != "nov" and splitted[1].lower() != "dec":
                k1 = ""
                v1 = ""
            else:
                monthInNumber = changeMonths(splitted[1])
                k1 = splitted[0] + "/" + monthInNumber
                if len(str(v1)) > 5:
                    if k1 in d["lock"]:
                        d["lock"].update({k1: d["lock"][k1] + v1})
                    else:
                        d["lock"].update({k1:v1})
        else:
            if k == "unlock":
                splitted = k1.split("-")
                if splitted[1].lower() != "jan" and splitted[1].lower() != "feb" and splitted[1].lower() != "mar" and \
                        splitted[1].lower() != "apr" \
                        and splitted[1].lower() != "may" and splitted[1].lower() != "jun" and splitted[
                    1].lower() != "jul" and splitted[1].lower() != "aug" \
                        and splitted[1].lower() != "sep" and splitted[1].lower() != "oct" and splitted[
                    1].lower() != "nov" and splitted[1].lower() != "dec":
                    k1 = ""
                    v1 = ""
                else:
                    monthInNumber = changeMonths(splitted[1])
                    k1 = splitted[0] + "/" + monthInNumber
                    if len(str(v1)) > 5:
                        # print(d["u"])
                        if k1 in d["unlock"]:
                           d["unlock"].update({k1: d["unlock"][k1] + v1})
                        else:
                            d["unlock"].update({k1: v1})

final_dictionary = {"lock": {},
                    "unlock": {}}

for i in d:
    k = 0
    for j in d[i]:
        if i == "lock":
            u_value = set(d[i][j])
            final_dictionary["lock"][k] = ({"Dates": j, "NumberOfUsage": len(d[i][j]), "NumberOfUsers": len(u_value)})
            k = k+1
        if i == "unlock":
            u_value = set(d[i][j])
            final_dictionary["unlock"][k] = ({"Dates": j, "NumberOfUsage": len(d[i][j]), "NumberOfUsers": len(u_value)})
            k = k+1


with open("locks_and_unlocks4.json", "w") as f:
    json.dump(final_dictionary, f)















