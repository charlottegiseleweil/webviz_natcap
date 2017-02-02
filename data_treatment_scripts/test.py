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
col_absolute = match_columns(".+_abs$", all_column_names)
col_activity_stat = match_columns(".+_(frac_area|frac_alloc|npix|budg)$", all_column_names)
col_lulc_rast = ['port_rast', 'lulc_w_port']

df_min_columns = col_weights + col_relative + col_lulc_rast

df_min = df[df_min_columns]

print(df_min.columns)

df_min.replace(['fake_raster1.tif'], ['../data/testlulc.tif'])

df_min.to_csv('../data/maragua_min_test.csv')
#col_relatives = return_matches(".+_rel$", names)
#print return_matches(".+_pix_ave.*", rels)
#print return_matches(".+_rast_.*", rels)
#print return_matches(".+_agg_.*", rels)