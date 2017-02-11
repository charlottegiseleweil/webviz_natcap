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
df = pd.read_csv('../data/raw_data/mastertable_2017-02-09.csv')

#Group columns
col_weights = match_columns(".+_wt$", df.columns)
col_scores = match_columns(".+_agg_.*", df.columns)
col_useless = ['wt_case','cost_wt', 'cost','sdr_biophysical_table_path','awy_biophysical_table_uri']

#Remove useless columns
df.drop(col_useless, axis=1, inplace=True)

#Trim decimals in objective scores
#df['SDE_2_agg_delta_abs']=round(df['SDE_2_agg_delta_abs'])
df['SDE_2_agg_delta_abs']=df['SDE_2_agg_delta_abs'].apply(round)

#Transform categorical parameter to continuous (for 'spatial parameter A/B' A:0, B:1)
df.loc[df['cat_scen'] =='A', 'cat_scen'] = 0
df.loc[df['cat_scen'] =='B', 'cat_scen'] = 1


#Change path to rasters
df.replace("Maragua obj scores from 2017-02-04 solns", "Maragua_maps", regex=True, inplace=True)

#Index name
df.index.name = "index"

#Rename columns
new_cols={'obj_1_wt':'sde_weight','obj_2_wt':'sdl_weight','obj_3_wt':'awy_weight','AWY_1_agg_delta_abs':'awy_score','SDE_2_agg_delta_abs':'sde_score','SDL_3_agg_delta_abs':'sdl_score', 'sdr_1':'input_1','awy_1':'input_2', 'cat_scen':'input_spat', 'budget':'input_budget'}
df.rename(columns=new_cols, inplace=True)

#Divide by 10^6 all obj scores
for i in ['sde_score','awy_score','sdl_score']:
	df[i] = df[i]/1e6

#Reorder columns
df_reordered = df[['awy_weight','sde_weight', 'sdl_weight','awy_score','sde_score', 'sdl_score','esm_case','input_budget', 'input_2','input_1','input_spat', 'AWY_1_rast_delta_abs', 'SDE_2_rast_delta_abs','SDL_3_rast_delta_abs']]

#check
print(df_reordered.columns)

#Write cleaned file
df_reordered.to_csv('../data/MaraguaFeb9.csv')
