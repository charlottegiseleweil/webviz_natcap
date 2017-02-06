import pandas as pd

df = pd.read_csv('../data/fake1.csv')



for i in ['sde_score','awy_score','sdl_score']:
	df[i] = df[i]/10e6


print(df)