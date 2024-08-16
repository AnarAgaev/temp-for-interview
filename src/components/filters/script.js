// Filters
const showNoFilterMsg = () => {
  try {


    const msg = document.querySelector(".description__msg");

    if (!msg) return;
    msg.classList.add("display");
    setTimeout(() => msg.classList.add("visible"), 100);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hideNoFilterMsg = () => {
  try {
    const msg = document.querySelector(".description__msg");

    if (!msg) return;

    msg.classList.remove("visible");
    msg.classList.remove("display");
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkNoFilterMsg = () => {
  try {
    const items = document
      .querySelectorAll("[data-filter]:not(.hide)");

    items.length === 0
      ? showNoFilterMsg()
      : hideNoFilterMsg();
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hideFilterList = (filterList) => {
  try {
    filterList.forEach(filter => {
      filter.classList.remove("dropped");
      setTimeout(() => filter.classList.remove("active"), 300);
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const showFilterDrop = (node) => {
  try {
    node.classList.add("active");
    setTimeout(() => node.classList.add("dropped"), 10);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hideFilterDrop = (node) => {
  try {
    const filters = Array.from(document.querySelectorAll(".filters__item"));

    if (!node) {
      hideFilterList(filters);
      return;
    }
    const cleanedFilters = filters.filter(filter => filter !== node);
    hideFilterList(cleanedFilters);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initFiltersDrop = () => {
  try {
    const filters = Array.from(document
      .querySelectorAll(".filters__list .filters__item"));

    filters.forEach(filter => {
      filter.addEventListener("click", function() {
        const isActive = this.classList.contains("active");

        if (isActive) {
          hideFilterDrop();
          return;
        }

        hideFilterDrop(this);
        showFilterDrop(this);
      });
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initFiltersReset = () => {
  try {
    const isPageCatalog = document.querySelector(".page-catalog");
    if (isPageCatalog) return;

    const reset = document.querySelector(".filters__reset .filters__item");

    if (!reset) return;

    const filteredSection = document
      .querySelectorAll(".section_filtered");

    reset.addEventListener("click", function() {
      const container = this.closest(".filters");

      const siblingFilters = container
        .querySelectorAll(".filters__list .filters__item");

      const options = Array.from(document
        .querySelectorAll(".filters__options"));

      const controllers = Array.from(document
        .querySelectorAll(".filters input[type=\"radio\"]:not([value=\"reset\"])"));

      const cards = Array.from(document.querySelectorAll("[data-filter]"));

      const deletedTypes = JSON.parse(document
        .querySelector("[data-deleted-types]")
        .dataset.deletedTypes);

      hideFilterList(siblingFilters);
      spinner.show();
      filteredSection.forEach(el => el.classList.add("filtering"));
      options.forEach(el => el.classList.remove("checked")); // hide rset option button
      controllers.forEach(controller => controller.checked = false); // reset all input controllers
      resetAllControllersInItems();
      reset.closest(".filters__reset").classList.add("disabled");

      setTimeout(() => {
        // show hidden cards as delete data-display attributes
        cards.forEach(card => {
          for (const type of deletedTypes) {
            card.removeAttribute(`data-display-${type}`);
            card.classList.remove("hide");
          }
        });

        checkFilteredSection();
      }, 1000);
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkFilteredSection = () => {
  try {
    const sections = Array.from(document.querySelectorAll(".section_filtered"));

    sections.forEach(section => {
      const filteredItems = Array.from(section.querySelectorAll("[data-filter]"));
      const shownItems = filteredItems.filter(i => !i.classList.contains("hide"));

      if (shownItems.length === 0) {
        section.classList.add("hide");
      } else {
        section.classList.remove("hide");
      }
    });

    spinner.hide();
    sections.forEach(el => el.classList.remove("filtering"));

    showAnimElements();
    setAnimationElms();
    checkNoFilterMsg();
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hasDataDisplayAttribute = (node) => {
  try {
    const attributes = node.attributes;

    let hasDataDisplayAttribute = false;

    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributes[i].name;

      if (attributeName.startsWith("data-display")) {
        hasDataDisplayAttribute = true;
        break;
      }
    }

    return hasDataDisplayAttribute;
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkFilteredItem = (prop, val) => {
  try {
    const items = Array.from(document.querySelectorAll("[data-filter]"));

    setTimeout(() => {
      items.forEach(i => {
        const data = JSON.parse(i.dataset.filter);
        const isArray = Array.isArray(data[prop]);

        const isMatched = isArray
          ? data[prop].includes(val)
          : data[prop] === val;


        if (isMatched) {
          i.removeAttribute(`data-display-${prop}`);
          if (!hasDataDisplayAttribute(i)) i.classList.remove("hide");
        } else {
          i.classList.add("hide");
          i.setAttribute(`data-display-${prop}`, false);
        }

        checkFilteredSection();
      });
    }, 1000);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const activeColorInItem = (val) => {
  try {
    const items = Array.from(document
      .querySelectorAll(`[data-target-type="${val}"]`));

    items.forEach(i => i.click());
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initFilterSelect = () => {
  try {
    const isPageCatalog = document.querySelector(".page-catalog");
    if (isPageCatalog) return;

    const controllers = Array.from(document
      .querySelectorAll(".filters input[type=\"radio\"]:not([value=\"reset\"])"));

    const filteredSection = document.querySelectorAll(".section_filtered");

    const resetBtn = document.querySelector(".filters__reset");

    controllers.forEach(el => el.addEventListener("change", function(e) {
      e.preventDefault();
      e.stopPropagation();

      filteredSection.forEach(el => el.classList.add("filtering"));
      spinner.show();
      checkFilteredItem(this.name, this.value);
      activeColorInItem(this.value);
      this.closest(".filters__options").classList.add("checked");
      resetBtn.classList.remove("disabled");
    }));
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const removeDataFilterAttribute = (prop) => {
  try {
    const items = Array.from(document
      .querySelectorAll(`[data-display-${prop}]`));

    items.forEach(i => {
      i.removeAttribute(`data-display-${prop}`);
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkAllItemsHasDisplayAttributes = () => {
  try {
    const items = Array.from(document
      .querySelectorAll("[data-filter]"));

    items.forEach(i => {
      if (!hasDataDisplayAttribute(i)) {
        i.classList.remove("hide");
      }
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const resetAllControllersByName = (name) => {
  try {
    const items = Array.from(document.querySelectorAll(`[name=${name}]`));
    items.forEach(i => i.checked = false);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const resetAllControllersInItems = () => {
  try {
    const tabLists = Array.from(document
      .querySelectorAll(".cards-series__controls"));

    tabLists.forEach(list => {
      list.querySelector(".cards-series__tab")?.click();
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkAllFilterResetBtn = () => {
  try {
    const isCheckedFilter = document
      .querySelectorAll(".filters__list input:checked");

    const reset = document.querySelector(".filters__reset");

    isCheckedFilter.length === 0
      ? reset.classList.add("disabled")
      : reset.classList.remove("disabled");
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initResetFilterProp = () => {
  try {
    const isPageCatalog = document.querySelector(".page-catalog");
    if (isPageCatalog) return;

    const controllers = Array.from(document
      .querySelectorAll(".filters input[value=\"reset\"]"));
    const sections = document.querySelectorAll(".section_filtered");

    controllers.forEach(el => el.addEventListener("change", function(e) {
      e.preventDefault();
      e.stopPropagation();

      sections.forEach(el => el.classList.add("filtering"));
      spinner.show();
      this.closest(".filters__options").classList.remove("checked");

      setTimeout(() => {
        removeDataFilterAttribute(this.name);
        checkAllItemsHasDisplayAttributes();
        checkFilteredSection();
        resetAllControllersByName(this.name);
        resetAllControllersInItems();
        checkAllFilterResetBtn();
      }, 1000);
    }));
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

window.addEventListener("load", () => {
  try {
    initFiltersDrop();
    initFiltersReset();
    initFilterSelect();
    initResetFilterProp();
  } catch (e) {
    console.warn("вёрстка", e);
  }
});