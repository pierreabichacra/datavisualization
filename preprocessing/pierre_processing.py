import pandas as pd


data = pd.read_csv("datasetName.csv", usecols=["col needed", "col needed"])
data = data.dropna() #drops the null values when needed
# data = data.sort_values(by = 'SelfReportCheckSmartphone') #sorts the values to show the vis clearly because we don't have dates
data.to_csv(r'dir/NEW/actualminsVSselfrepmins.csv', index=True) #returns the cleaned csv for a certain vis with/without index
data.head()