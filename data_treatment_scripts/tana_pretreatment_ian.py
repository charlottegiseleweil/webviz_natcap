import re
import pandas as pd

#Functions
def match_columns(pat, names):
	result = []
	for name in names:
		if re.findall(pat, name):
			result.append(name)
	return result


#Load data
df = pd.read_csv('../data/Maragua_6_2_2017.csv')

#all_column_names = df.columns ========check that unnecessary

#Group columns
col_weights = match_columns(".+_wt$", df.columns)
col_scores = match_columns(".+_agg_.*", df.columns)
col_useless = ['wt_case', 'cost_wt', 'cost','sdr_biophysical_table_path','awy_biophysical_table_uri']

#Remove useless columns
df.drop(col_useless, axis=1, inplace=True)

#Trim decimals in objective scores
df['SDE_2_agg_delta_abs']=df['SDE_2_agg_delta_abs'].apply(round)

#Transform categorical parameter to continuous (for 'spatial parameter A/B' A:0, B:1)
df.loc[df['cat_scen'] == 'A', 'cat_scen'] = 0
df.loc[df['cat_scen'] == 'B', 'cat_scen'] = 1


#Change path to rasters
df.replace('Maragua obj scores from 2017-02-04 solns', 'Maragua_maps', regex=True, inplace=True) #Maragua obj scores from 2017-02-04 solns
print(df.ix[0])
#Index name
df.index.name = "index"


#check
# print(df)

#Write cleaned file
df.to_csv('../data/Maragua.csv')
