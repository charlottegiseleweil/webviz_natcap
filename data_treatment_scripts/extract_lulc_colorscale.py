import csv

Names_List = []
Cat_List = []

with open('../data/raw_data/lulc_colorscale.csv', 'rb') as file:
    reader = csv.reader(file, delimiter=',', quotechar='|')
    for row in reader:
        Names_List.append(row[0])
        Cat_List.append(row[1])


for list in (Names_List,Cat_List):
    list.remove(list[0])
    if list == Cat_List:
        for i in range(len(Cat_List)):
            Cat_List[i] = int(Cat_List[i])
    print(list)
