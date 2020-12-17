var $profileForm = document.querySelector('.profile-form');
var $profileName = document.querySelector('.profile-name')
var $searchForm = document.querySelector('.search-form');
var $recipeSection = document.getElementById('recipe-section');

$profileForm.addEventListener('submit', function(event) {
  data.username = document.getElementById('user-name').value;
  if (data.username === '') {
    event.preventDefault();
    return;
  }

  $profileName.textContent = document.getElementById('user-name').value;

  var dataJSON = JSON.stringify(data);
  localStorage.setItem('project-local-storage', dataJSON);
  $profileForm.reset();
  changeView('search');
  event.preventDefault();
})

function changeView(view) {
  var $views = document.querySelectorAll('.display');

  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-view') === view) {
      $views[i].className = 'display';
    }
    else {
      $views[i].className = 'hidden display';
    }
  }
}

$searchForm.addEventListener('submit', function(event) {
  var dish = document.getElementById('dish').value;
  var diet = document.getElementById('diet').value;
  var nutrition = document.getElementById('nutrition').value;
  if (diet !== "") {
    diet = '&health=' + document.getElementById('diet').value;
  }
  if (nutrition !== "") {
    nutrition = '&diet=' + document.getElementById('nutrition').value;
  }
  var xhr = new XMLHttpRequest();
  var _url = 'https://api.edamam.com/search?q=' + dish + '&app_id=4ec8f0b8&app_key=25713e68788fd4267505ef53ddc5081d' + diet + nutrition;

  xhr.open('GET', _url)
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var recipeList = xhr.response;
    $recipeSection.innerHTML = '';
    for (var i = 0; i < recipeList.hits.length; i++) {
      $recipeSection.appendChild(renderRecipe(recipeList.hits[i]));
    }
  });
  xhr.send();
  $searchForm.reset();
  changeView('recipe-list');
  event.preventDefault();
})

function renderRecipe(recipes) {
var $row = document.createElement('div');
$row.className = 'row recipe-row';

var $columnOne = document.createElement('div');
$columnOne.className = 'column-half';

var $columnTwo = document.createElement('div');
$columnTwo.className = 'column-half recipe-info';

var $imageContainer = document.createElement('div');
$imageContainer.className = 'image-container';

var $image = document.createElement('img');
$image.className = 'recipe-image';
$image.setAttribute('src', recipes.recipe.image);

var $recipeName = document.createElement('h3');
$recipeName.className = 'recipe-title';
$recipeName.textContent = recipes.recipe.label;

var $div = document.createElement('div');
$div.className = 'align';

var $anchor = document.createElement('a');
$anchor.className = 'recipe-link';
$anchor.setAttribute('target', '_blank');
$anchor.setAttribute('href', recipes.recipe.url)

var $recipeButton = document.createElement('button');
$recipeButton.className = 'recipe-button';
$recipeButton.textContent = 'Go To Recipe!'

var $favoriteButton = document.createElement('button');
$favoriteButton.className = 'favorite-button';
$favoriteButton.textContent = 'Add To Favorites';

$anchor.appendChild($recipeButton);
$div.appendChild($anchor);
$div.appendChild($favoriteButton);
$columnTwo.appendChild($recipeName);
$columnTwo.appendChild($div);
$imageContainer.appendChild($image);
$columnOne.appendChild($imageContainer);
$row.appendChild($columnOne);
$row.appendChild($columnTwo);

return $row;
}

function renderFavorites(favoritesData) {
  var $row = document.createElement('div');
  $row.className = 'row recipe-row';

  var $columnOne = document.createElement('div');
  $columnOne.className = 'column-half';

  var $columnTwo = document.createElement('div');
  $columnTwo.className = 'column-half recipe-info';

  var $imageContainer = document.createElement('div');
  $imageContainer.className = 'image-container';

  var $image = document.createElement('img');
  $image.className = 'recipe-image';
  $image.setAttribute('src', favoritesData.image);

  var $recipeName = document.createElement('h3');
  $recipeName.className = 'recipe-title';
  $recipeName.textContent = favoritesData.title;

  var $div = document.createElement('div');
  $div.className = 'align';

  var $anchor = document.createElement('a');
  $anchor.className = 'recipe-link';
  $anchor.setAttribute('target', '_blank');
  $anchor.setAttribute('href', favoritesData.link)

  var $recipeButton = document.createElement('button');
  $recipeButton.className = 'recipe-button';
  $recipeButton.textContent = 'Go To Recipe!'

  $anchor.appendChild($recipeButton);
  $div.appendChild($anchor);
  $columnTwo.appendChild($recipeName);
  $columnTwo.appendChild($div);
  $imageContainer.appendChild($image);
  $columnOne.appendChild($imageContainer);
  $row.appendChild($columnOne);
  $row.appendChild($columnTwo);

  return $row;
}


var $favoritesSection = document.getElementById('favorites-section');

window.addEventListener('click', function(event) {

  if (event.target.tagName === "A" && event.target.getAttribute('href') === '#') {
    changeView(event.target.getAttribute('data-view'));
    if (event.target.getAttribute('data-view') === 'favorites') {
      $recipeSection.innerHTML = '';
      $favoritesSection.innerHTML = '';
      for (var i = 0; i < currentData.favorites.length; i++) {
        $favoritesSection.appendChild(renderFavorites(currentData.favorites[i]));
      }
    }
  }
  else {
    return;
  }
})


addEventListener('click', function(event) {
  if (event.target.className === 'favorite-button' && event.target.textContent !== 'Favorited') {
  var $recipeNames = document.querySelectorAll('.recipe-title');
  var $recipeImage = document.querySelectorAll('.recipe-image');
  var $recipeLink = document.querySelectorAll('.recipe-link');
  var $favButtons = document.querySelectorAll('.favorite-button');
  for (var i = 0; i < $favButtons.length; i++) {
    if ($favButtons[i] === event.target) {
      var favoritedRecipe = {};
      favoritedRecipe.title = $recipeNames[i].textContent;
      favoritedRecipe.image = $recipeImage[i].getAttribute('src');
      favoritedRecipe.link = $recipeLink[i].getAttribute('href');
      currentData.favorites.push(favoritedRecipe);
      var favoritesDataJSON = JSON.stringify(currentData);
      localStorage.setItem('project-local-storage', favoritesDataJSON);
      $favButtons[i].textContent = 'Favorited';
    }
  }
  }
})
