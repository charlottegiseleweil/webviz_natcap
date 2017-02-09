import pandas as pd

df = pd.read_csv('../data/Maragua_6_2_2017.csv')

len(df)

print(len(df))

for i in range (0,len(df)):
	print i