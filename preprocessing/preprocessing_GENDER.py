import pandas as pd


data = pd.read_csv("CLEANED SSCoDA Survey Data Extra_Cleaned_from_Corona.csv", usecols=["Gender", "Age", "Eastern_Western"])
data = data.dropna()
data = data.sort_values(by = 'Gender')
data.to_csv(r'Gender.csv', index=False)