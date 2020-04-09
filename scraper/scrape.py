import requests
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('groceasy-ec29b-6386e49eaf5a.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

recipe_ref = db.collection(u'recipe')
tag_ref = db.collection(u'tag')
ingredient_ref = db.collection(u'ingredient')

BASE_URL = 'https://www.traderjoes.com'
RECIPES_URL = '/recipes/'
PAGE_URL = '/page/'

highLevelTags = []
tagKeys = {}
highLevelIngredients = []
ingKeys = {}

def addTag(tag):
	if tag not in highLevelTags:
		highLevelTags.append(tag)
		tagKeys[tag] = len(highLevelTags)
	return tagKeys[tag]

def addIngredient(ing):
	if ing not in highLevelIngredients:
		highLevelIngredients.append(ing)
		ingKeys[ing] = len(highLevelIngredients)
	return ingKeys[ing]

def getRecipe(url):
	print(url)
	page = requests.get(url)
	soup = BeautifulSoup(page.content, 'html.parser')
	title = soup.find('h3', { 'class': 'lead mt-m10 mb-m5'}).text.strip()
	img = BASE_URL + soup.find('div', { 'class': 'border-image'}).img['src']
	details = soup.find('div', { 'class': 'hidden-xxs hidden-xs hidden-sm hidden-smd visible-md visible-lg'}).p.text.strip().split('\n')
	serves = details[0].split(':')[1].strip()
	prepTime = ''
	if(len(details) > 3):
		prepTime = details[3].split('s')[0].strip()
	cookingTime = ''
	if(len(details) > 4):
		cookingTime = details[4].split(':')[1].strip().split('s')[0].strip()
	ingredients = []
	for ingredient in soup.find('ul', { 'class': 'bullet-list'}).find_all('li'):
		text = ingredient.find('div').text.strip()
		# text = text.split('TJ’s')
		# if(len(text) == 1):
		# 	text = text[0].split('TJ\'s')
		# if(text[0] == ''):
		# 	continue
		# print(text)
		# amount = text[0].strip()
		# item = text[1].strip().split('or')[0].strip().split(',')[0].strip()
		# ingredientId = addIngredient(item);
		# ingredients.append({ 'ingredient_id': ingredientId, 'amount': amount, 'name': item })
		ingredients.append(text)
	directions = ''
	for pText in soup.find_all('div', { 'class': 'article'})[3].find_all('p', {'class': None}):
		directions = directions + pText.text.strip();
	tags = []
	tagIds = []
	for tag in soup.find_all('a', { 'class': 'reltag'}):
		newTag = tag.text.strip()
		tagId = addTag(newTag)
		tagIds.append(tagId)
		tags.append({ 'tagId': tagId, 'name': newTag })
	recipe = {
		'title': title,
		'img': img,
		'serves': serves,
		'prepTime': prepTime,
		'cookingTime': cookingTime,
		'directions': directions,
		'ingredients': ingredients,
		'tags': tags,
		'tagIds': tagIds
	}
	print(recipe)
	return recipe

def getRecipeUrls(url):
	i = 1
	count = 1;
	valid = True
	while valid:
		page = requests.get(url + PAGE_URL + str(i));
		soup = BeautifulSoup(page.content, 'html.parser')
		products = soup.find_all('div', { 'class': 'col-sm-6 col-xs-6 col-xxs-12 searchresult-grid' })
		if(len(products) > 0):
			for product in products:
				productUrl = product.find('a')['href']
				recipe_ref.add(getRecipe(BASE_URL + productUrl))
				print('Recipe Added')
				count += 1
			i += 1
		else:
			valid = False
	return count

def main():
	page = requests.get(BASE_URL + RECIPES_URL)
	soup = BeautifulSoup(page.content, 'html.parser')
	sideBarResults = soup.find(id='sidebar')
	links = sideBarResults.find_all('a')

	for link in links:
		print("Type: ", link.text, " Link: ", BASE_URL + link['href'])
		print('Added ', getRecipeUrls(BASE_URL + link['href']), ' recipes')

	# for ing in highLevelIngredients:
	# 	ingredient_ref.document(ingKeys[ing]).set({ 'name': ing })

	for tag in highLevelTags:
		tag_ref.document(str(tagKeys[tag])).set({ 'name': tag })



main()
# print(getRecipe('https://www.traderjoes.com/recipes/appetizers-sides/sweet-balls-of-fire'))
# getRecipeUrls('https://www.traderjoes.com/recipes/desserts')