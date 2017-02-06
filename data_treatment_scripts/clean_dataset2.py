import re
import pandas as pd

df_dataset1 = pd.read_csv('../data/raw_data/obj_scores_finally.csv')

all_column_names = df_dataset1.columns

# def match_columns(pat, names):
# 	result = []
# 	for name in names:
# 		if re.findall(pat, name):
# 			result.append(name)
# 	return result

# col_weights = match_columns(".+_weight$", all_column_names)
# col_parametric_uncertainty = ['sdr_1','awy_1', 'spatial_inputs', 'budget_level']
# col_relative = match_columns(".+_rel$", all_column_names)
# col_rel_obj = match_columns(".+_agg_.*", col_relative)
# col_absolute = match_columns(".+_abs$", all_column_names)
# col_activity_stat = match_columns(".+_(frac_area|frac_alloc|npix|budg)$", all_column_names)
# col_lulc_rast = ['port_rast', 'lulc_w_port']

# #df_min : wts + rel + lulc rast
# df_min_columns = col_weights + col_relative #+ col_lulc_rast
# df_min = df[df_min_columns]
# df_min.replace(['fake_raster1.tif'], ['../data/testlulc.tif'])
# df_min.to_csv('../data/maragua_min_test.csv')

#df_very_min : wts + obj_score(rel)
#df_dataset1 = col_weights + col_rel_obj
#df_very_min = df_min[df_very_min_columns]
df_dataset1.drop('cost_weight', axis=1, inplace=True)
df_dataset1.drop('cost_score', axis=1, inplace=True)
df_dataset1.drop('esm_case', axis=1, inplace=True)
df_dataset1.drop('index', axis=1, inplace=True)
df_dataset1.index.name = "index"

df_reordered = df_dataset1[['awy_weight','sde_weight', 'sdl_weight','awy_score', 'sde_score', 'sdl_score']]
#df_very_min.drop(df.index[10:809], axis=0, inplace=True)
print(df_reordered.columns)
#print(df_reordered)

#Divide by 10e6 all obj scores
for i in ['sde_score','awy_score','sdl_score']:
	df_reordered[i] = df_reordered[i]/10e5

#new_cols={'obj_1_wt':'awy_weight','obj_2_wt':'sde_weight','obj_3_wt':'sdl_weight','AWY_1_agg_delta_rel':'awy_score','SDE_2_agg_delta_rel':'sde_score','SDL_3_agg_delta_rel':'sdl_score', 'sdr_1'='input_1','awy_1', 'spatial_inputs', 'budget_level']}
#df_very_min.rename(columns=new_cols, inplace=True)
df_reordered.to_csv('../data/maragua_dataset1.csv')


#col_relatives = return_matches(".+_rel$", names)
#print return_matches(".+_pix_ave.*", rels)
#print return_matches(".+_rast_.*", rels)
#print return_matches(".+_agg_.*", rels)