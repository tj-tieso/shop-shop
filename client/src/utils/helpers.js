export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + "s";
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database `shop-shop` with the version of 1
    const request = window.indexedDB.open("shop-shop", 1);

    // create variables to hold reference to the database, transaction (tx), and object store
    let db, tx, store;

    // if version has changed (or this is the first time using database),
    // run this method and create the three object stores
    request.onupgradeneeded = function (e) {
      const db = request.result;
      // create object store for each type of data and set "primary" key index to be the `_id` of the data
      db.createObjectStore("products", { keyPath: "_id" });
      db.createObjectStore("categories", { keyPath: "_id" });
      db.createObjectStore("cart", { keyPath: "_id" });
    };

    // handle any errors with connecting
    request.onerror = function (e) {
      console.log("There was an error");
    };

    request.onsuccess = function (e) {
      // save reference of DB to `db` variable
      db = request.result;
      // open a transaction do whatever we pass into `storeName`
      // (must match one of the object store names)
      tx = db.transaction(storeName, "readwrite");
      // save a reference to that object store
      store = tx.objectStore(storeName);

      // log any errors
      db.onerror = function (e) {
        console.log("error", e);
      };

      // check which value we passed into the function as a method
      // and perform that method on the object store:
      switch (method) {
        //  run .put() method on object store,
        // overwrite any data with the matching _id value from the object
        // and add it if it can't find a match
        case "put":
          store.put(object);
          resolve(object);
          break;
        // get all data from the object store and return it
        case "get":
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case "delete":
          store.delete(object._id);
          break;
        default:
          console.log("No valid method");
          break;
      }

      // when transaction is complete, close connection
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
