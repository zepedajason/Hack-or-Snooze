"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  // update when there is no user connected, no star shown
  // When the user is authenticated, you should display either a full or empty star depending on whether it's a favorite or not. You can write a separate function to handle that logic
  const hostName = story.getHostName();

  let star = "";
  if (currentUser){
    star = `<span class="star">
    <i class="far fa-star"></i>
  </span>`;
  }
  //check if story is favorite or not

  return $(`
      <li id="${story.storyId}">
        ${star}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function checkIfFavorite(user, story) {
  if(user.isFavorite(story) == true){
    console.log(true);
  }
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//Write a function in stories.js that is called when users submit the form. Pick a good name for it. This function should get the data from the form, call the .addStory method you wrote, and then put that new story on the page.
// When user submits form, get data from form and add story to storylist
async function addUserSubmittedStory(evt){
  evt.preventDefault();

   const author = $("#author").val();
   const title = $("#title").val();
   const url = $("#url").val();
   const username = currentUser.username;
   let storyObj = {title, url, author, username}
   const newStory = await storyList.addStory(currentUser, storyObj);

  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);
  
  $submitForm.trigger("reset");
  $submitForm.hide();
  
}

$submitForm.on("submit", addUserSubmittedStory);

function showFavorites() {
  $favoriteStories.empty();
  // currentUser.favorites.forEach(element => {
  //   const story = generateStoryMarkup(element);
  //   $favoriteStories.append(story)
  //  });
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStories.append($story);
  }

$favoriteStories.show();
}

async function selectFavorite(evt) {
  //check based on list of user favorites
  //think of how to perform differation in list
  //call function to select favorite
  //after function update story list
  const target = $(evt.target);
  const story = storyList.stories.find(element => element.storyId === element.storyId);

  if(target.hasClass("far")){
    await currentUser.addFavorite(story);
    console.log("added to favorites");
    target.closest("i").attr("class", "fas fa-star");
  } else if(target.hasClass("fas")){
    await currentUser.removeFavorite(story);
    console.log("removed from favorites")
    target.closest("i").attr("class", "far fa-star");
  }
}

$allStoriesList.on("click", ".star", selectFavorite);
