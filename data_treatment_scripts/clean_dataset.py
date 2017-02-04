import re
import pandas as pd

df = pd.read_csv('../data/raw_data/maragua_specific_and_trim.csv')

all_column_names = df.columns

def match_columns(pat, names):
	result = []
	for name in names:
		if re.findall(pat, name):
			result.append(name)
	return result

col_weights = match_columns(".+_wt$", all_column_names)
col_parametric_uncertainty = ['sdr_1','awy_1', 'spatial_inputs', 'budget_level']
col_relative = match_columns(".+_rel$", all_column_names)
col_rel_obj = match_columns(".+_agg_.*", col_relative)
col_absolute = match_columns(".+_abs$", all_column_names)
col_activity_stat = match_columns(".+_(frac_area|frac_alloc|npix|budg)$", all_column_names)
col_lulc_rast = ['port_rast', 'lulc_w_port']

#df_min : wts + rel + lulc rast
df_min_columns = col_weights + col_relative + col_lulc_rast
df_min = df[df_min_columns]
df_min.replace(['fake_raster1.tif'], ['../data/testlulc.tif'])
df_min.to_csv('../data/maragua_min_test.csv')

#df_very_min : wts + obj_score(rel)
df_very_min_columns = col_weights + col_rel_obj
df_very_min = df_min[df_very_min_columns]
df_very_min.drop('obj_wtd_agg_delta_rel', axis=1, inplace=True)
df_very_min.index.name = "index"
df_very_min.drop(df.index[10:809], axis=0, inplace=True)
print(df_very_min.columns)

new_cols={'obj_1_wt':'awy_weight','obj_2_wt':'sde_weight','obj_3_wt':'sdl_weight','AWY_1_agg_delta_rel':'awy_score','SDE_2_agg_delta_rel':'sde_score','SDL_3_agg_delta_rel':'sdl_score'}
df_very_min.rename(columns=new_cols, inplace=True)
df_very_min.to_csv('../data/maragua_very_min_test.csv')


#col_relatives = return_matches(".+_rel$", names)
#print return_matches(".+_pix_ave.*", rels)
#print return_matches(".+_rast_.*", rels)
#print return_matches(".+_agg_.*", rels)