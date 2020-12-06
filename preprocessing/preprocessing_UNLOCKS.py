import pandas as pd
import json

data = pd.read_csv('CLEANED Unlocks (cleaned R13-08-20).csv')

d = {k: f.groupby('Date')['User Key'].apply(list).to_dict()
     for k, f in data.groupby('Operation (Lock or Unlock)')}

with open("locks_and_unlocks2.json", "w") as f:
    json.dump(d, f)


