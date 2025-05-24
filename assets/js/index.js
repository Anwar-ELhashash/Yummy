"use strict";
// ==================== Selectors ====================
const nav = document.querySelector("aside .nav");
const row = document.getElementById("rowData");
const searchSection = document.getElementById("searchSection");
const contactUs = document.getElementById("contactUs");
const allInputs = Array.from(document.querySelectorAll("#contactUs input"));
const submitBtn = document.getElementById("submitBtn");
let menuObject;
// ==================== Show sideBar  ====================
$("aside").css({ left: -$("#inVisible").innerWidth() });
let isOpen = false;
$("#visible button").on("click", () => {
  if (isOpen === false) {
    openSideBar();
  } else {
    closeSideBar();
  }
});
// ==================== Functions ====================
function openSideBar() {
  isOpen = true;
  $("aside").css({ left: 0 });
  $(".nav .nav-item").addClass("animate__fadeInBottomLeft");
  $("#toggleIcon").removeClass("fa-bars");
  $("#toggleIcon").addClass("fa-xmark");
}

function closeSideBar() {
  isOpen = false;
  $("aside").css({ left: -$("#inVisible").innerWidth() });
  $(".nav .nav-item").removeClass("animate__fadeInBottomLeft");
  $("#toggleIcon").addClass("fa-bars");
  $("#toggleIcon").removeClass("fa-xmark");
}

function resetWindow() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
}

async function getApi(api) {
  try {
    document.querySelector(".loading").classList.remove("d-none");
    const response = await fetch(api);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  } finally {
    document.querySelector(".loading").classList.add("d-none");
  }
}

class Menus {
  constructor(params) {
    this.params = params;
  }

  async getMeals(param) {
    try {
      document.querySelector(".loading").classList.remove("d-none");
      let result = await getApi(
        `https://www.themealdb.com/api/json/v1/1/${this.params}${param || ""}`
      );
      let arrOfMeals = [];
      for (let i = 0; i < result.meals.length; i++) {
        let htmlMeal = `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="data inner position-relative rounded-4 overflow-hidden cursor-pointer" data-id="${result.meals[i].idMeal}">
          <img src="${result.meals[i].strMealThumb}" class="w-100" alt="" />
          <div class="text position-absolute end-0 bottom-0 start-0 bg-white text-black bg-opacity-50 d-flex justify-content-center align-items-center text-center" >
            <h2 class="m-0">${result.meals[i].strMeal}</h2>
          </div>
        </div>
      </div>`;
        arrOfMeals.push(htmlMeal);
      }
      row.innerHTML = arrOfMeals.join("");
      let data = Array.from(document.querySelectorAll(".data"));
      data.forEach((ele) => {
        ele.addEventListener("click", () => {
          resetWindow();
          menuObject = new Menus();
          menuObject.getMealDetails(ele.getAttribute("data-id"));
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      document.querySelector(".loading").classList.add("d-none");
    }
  }

  async getIngredientAndMeasure(id) {
    let result = await getApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let ingredient = [];
    let measure = [];
    let spans = [];

    for (let key in result.meals[0]) {
      if (/^(strIngredient)[0-9]{1,2}$/.test(key)) {
        if (result.meals[0][key] !== "" && result.meals[0][key] !== " ") {
          ingredient.push(key);
        }
      } else if (/^(strMeasure)[0-9]{1,2}$/.test(key)) {
        if (result.meals[0][key] !== "" && result.meals[0][key] !== " ") {
          measure.push(key);
        }
      }
    }

    for (let i = 0; i < ingredient.length; i++) {
      spans.push(
        `<span class="badge me-1 bg-light py-2 bg-opacity-50 fs-12">${
          result.meals[0][measure[i]]
        } ${result.meals[0][ingredient[i]]}</span>`
      );
    }

    return spans.join("");
  }

  async getMealDetails(id) {
    try {
      document.querySelector(".loading").classList.remove("d-none");
      let result = await getApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      let htmlMeal = `
        <div id="detailsSection" class="row">
          <div class="col-12 d-flex justify-content-end py-2"><i onclick="closeDetails()" id="closeBtn" class="fa-solid fa-xmark fa-2x cursor-pointer"></i></div>
          <div class="col-12 col-sm-4">
            <div class="img rounded-3 overflow-hidden">
              <img class="w-100" src="${result.meals[0].strMealThumb}" alt="" />
            </div>
            <h3 class="mt-2">${result.meals[0].strMeal}</h3>
          </div>
          <div class="col-12 col-sm-8">
            <h1>Instructions</h1>
            <p>${result.meals[0].strInstructions}</p>
            <ul class="list-unstyled m-0 p-0">
              <li class="fs-2">Area : ${result.meals[0].strArea}</li>
              <li class="fs-2">Category : ${result.meals[0].strCategory}</li>
              <li class="fs-2"> Recipes : ${await menuObject.getIngredientAndMeasure(id)}</li>
              <li class="fs-2 mt-2">Tags :
                <a class="btn btn-success py-1" href="${
                  result.meals[0].strSource
                }" target="_blank">Source</a>
                <a class="btn btn-danger py-1" href="${
                  result.meals[0].strYoutube
                }" target="_blank">Youtube</a>
              </li>
            </ul>
          </div>
        </div>
    `;
      row.innerHTML = htmlMeal;
    } catch (error) {
      console.log(error);
    } finally {
      document.querySelector(".loading").classList.add("d-none");
    }
  }

  async searchMeal(searchKey) {
    try {
      document.querySelector(".loading").classList.remove("d-none");
      let result = await getApi(
        `https://www.themealdb.com/api/json/v1/1/${this.params}${searchKey}`
      );
      let arrOfMeals = [];
      for (let i = 0; i < result.meals.length; i++) {
        let htmlMeal = `
          <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="data inner position-relative rounded-4 overflow-hidden cursor-pointer" data-id="${result.meals[i].idMeal}">
              <img src="${result.meals[i].strMealThumb}" class="w-100" alt="" />
              <div class="text position-absolute end-0 bottom-0 start-0 bg-white text-black bg-opacity-50 d-flex justify-content-center align-items-center text-center" >
                <h2 class="m-0">${result.meals[i].strMeal}</h2>
              </div>
            </div>
          </div>`;
        arrOfMeals.push(htmlMeal);
      }
      row.innerHTML = arrOfMeals.join("");
      let data = Array.from(document.querySelectorAll(".data"));
      data.forEach((ele) => {
        ele.addEventListener("click", () => {
          resetWindow();
          searchSection.innerHTML = "";
          menuObject = new Menus();
          menuObject.getMealDetails(ele.getAttribute("data-id"));
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      document.querySelector(".loading").classList.add("d-none");
    }
  }

  async displayCategories() {
    try {
      document.querySelector(".loading").classList.remove("d-none");
      let result = await getApi(`https://www.themealdb.com/api/json/v1/1/${this.params}`);
      let arrOfMeals = [];
      for (let i = 0; i < result.categories.length; i++) {
        let htmlMeal = `
          <div class="col-12 col-md-6 col-lg-4 col-xlg-3">
            <div class="category inner position-relative rounded-4 overflow-hidden cursor-pointer" data-category="${
              result.categories[i].strCategory
            }">
              <img src="${result.categories[i].strCategoryThumb}" class="w-100" alt="" />
              <div class="text px-2 position-absolute end-0 bottom-0 start-0 bg-white text-black bg-opacity-75 d-flex flex-column justify-content-center text-center" >
                <h2 class="m-0">${result.categories[i].strCategory}</h2>
                <p class="m-0 fs-6">${result.categories[i].strCategoryDescription
                  .split("", 134)
                  .join("")}</p>
              </div>
            </div>
          </div>`;
        arrOfMeals.push(htmlMeal);
      }
      row.innerHTML = arrOfMeals.join("");
      let category = Array.from(document.querySelectorAll(".category"));
      category.forEach((ele) => {
        ele.addEventListener("click", () => {
          resetWindow();
          menuObject = new Menus("filter.php?c=");
          menuObject.getMeals(ele.getAttribute("data-category"));
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      document.querySelector(".loading").classList.add("d-none");
    }
  }

  async displayAreas() {
    try {
      document.querySelector(".loading").classList.remove("d-none");
      let result = await getApi(`https://www.themealdb.com/api/json/v1/1/${this.params}`);
      let arrOfMeals = [];
      for (let i = 0; i < result.meals.length; i++) {
        let htmlMeal = `
          <div class="col-12 col-sm-6 col-md-3 col-lg-2">
            <div class="area cursor-pointer  text-center" data-country="${result.meals[i].strArea}">
              <i class="fa-solid fa-map-location-dot fa-4x"></i>
              <p class="fs-26 mt-2">${result.meals[i].strArea}</p>
            </div>
          </div>`;
        arrOfMeals.push(htmlMeal);
      }
      row.innerHTML = arrOfMeals.join("");
      let area = Array.from(document.querySelectorAll(".area"));
      area.forEach((ele) => {
        ele.addEventListener("click", () => {
          resetWindow();
          menuObject = new Menus("filter.php?a=");
          menuObject.getMeals(ele.getAttribute("data-country"));
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      document.querySelector(".loading").classList.add("d-none");
    }
  }

  async displayIngredients() {
    try {
      document.querySelector(".loading").classList.remove("d-none");
      let result = await getApi(`https://www.themealdb.com/api/json/v1/1/${this.params}`);
      let resultLength = await result.meals;
      resultLength.length = 20;
      let arrOfMeals = [];
      for (let i = 0; i < resultLength.length; i++) {
        let htmlMeal = `
          <div class="col-12 col-md-4 col-lg-3 ">
            <div class="ingredient cursor-pointer  text-center">
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <h3 class="mt-2">${result.meals[i].strIngredient}</h3>
              <p class="mt-2">${result.meals[i].strDescription.split("", 100).join("")}</p>
            </div>
          </div>`;
        arrOfMeals.push(htmlMeal);
      }
      row.innerHTML = arrOfMeals.join("");
      let ingredient = Array.from(document.querySelectorAll(".ingredient"));
      ingredient.forEach((ele) => {
        ele.addEventListener("click", () => {
          resetWindow();
          menuObject = new Menus("filter.php?i=");
          menuObject.getMeals(ele.children[1].innerHTML);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      document.querySelector(".loading").classList.add("d-none");
    }
  }
}

// ==================== Events Of Nav ====================
nav.addEventListener("click", (e) => {
  if (e.target === nav.children[0].children[0]) {
    closeSideBar();
    row.innerHTML = "";
    contactUs.classList.add("d-none");
    searchSection.innerHTML = `
    <div class="row justify-content-center g-3 pb-5 mb-5">
            <div class="col-12 col-md-4">
              <input
                class="w-100 bg-transparent"
                type="search"
                name="searchN"
                id="searchName"
                placeholder="Search By Name"
              />
            </div>
            <div class="col-12 col-md-4">
              <input
                class="w-100 bg-transparent"
                type="search"
                name="searchL"
                id="searchLetter"
                placeholder="Search By First Letter"
                maxlength="1"
              />
            </div>
          </div>
    `;
    const searchName = document.getElementById("searchName");
    searchName.addEventListener("input", () => {
      menuObject = new Menus(`search.php?s=`);
      if (searchName.value !== "") {
        menuObject.searchMeal(searchName.value);
      }
    });
    const searchLetter = document.getElementById("searchLetter");
    searchLetter.addEventListener("input", () => {
      menuObject = new Menus(`search.php?f=`);
      if (searchLetter.value !== "") {
        menuObject.searchMeal(searchLetter.value);
      }
    });
  } else if (e.target === nav.children[1].children[0]) {
    closeSideBar();
    row.innerHTML = "";
    searchSection.innerHTML = "";
    contactUs.classList.add("d-none");
    menuObject = new Menus(`categories.php`);
    menuObject.displayCategories();
  } else if (e.target === nav.children[2].children[0]) {
    closeSideBar();
    row.innerHTML = "";
    searchSection.innerHTML = "";
    contactUs.classList.add("d-none");
    menuObject = new Menus("list.php?a=list");
    menuObject.displayAreas();
  } else if (e.target === nav.children[3].children[0]) {
    closeSideBar();
    row.innerHTML = "";
    searchSection.innerHTML = "";
    contactUs.classList.add("d-none");
    menuObject = new Menus("list.php?i=list");
    menuObject.displayIngredients();
  } else if (e.target === nav.children[4].children[0]) {
    closeSideBar();
    searchSection.innerHTML = "";
    row.innerHTML = "";
    contactUs.classList.remove("d-none");
  }
});
// ==================== When Window Load ====================
window.addEventListener("load", () => {
  menuObject = new Menus("search.php?s=");
  menuObject.getMeals();
});

function closeDetails() {
  menuObject = new Menus("search.php?s=");
  menuObject.getMeals();
}
// ==================== Validation Section ====================
function validateInput(ele, regex) {
  ele.addEventListener("input", (e) => {
    if (regex.test(ele.value)) {
      $(e.target).next().addClass("d-none");
    } else {
      $(e.target).next().removeClass("d-none");
    }
  });

  if (regex.test(ele.value)) {
    return true;
  } else {
    return false;
  }
}

function validRePass() {
  if (allInputs[4].value === allInputs[5].value) {
    $(allInputs[5]).next().addClass("d-none");
    return true;
  } else {
    $(allInputs[5]).next().removeClass("d-none");
    return false;
  }
}

function validateAllInputs() {
  if (
    validateInput(allInputs[0], /^[A-Za-z]+(?: [A-Za-z]+)*$/) &
    validateInput(allInputs[1], /^[^\s@]+@[^\s@]+\.[^\s@]+$/) &
    validateInput(allInputs[2], /^(?:\+20|0020|0)?1[0125][0-9]{8}$/) &
    validateInput(allInputs[3], /^(?:1[01][0-9]|120|[1-9]?[0-9])$/) &
    validateInput(
      allInputs[4],
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ) &
    validRePass()
  ) {
    submitBtn.classList.remove("disabled");
  } else {
    submitBtn.classList.add("disabled");
  }
}

allInputs.forEach((ele) => {
  ele.addEventListener("input", () => {
    validateAllInputs();
  });
});
