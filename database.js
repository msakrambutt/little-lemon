import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          "create table if not exists menuitems1 (id integer primary key not null, name text, price text, description text, image text, category text);"
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          "SELECT * FROM menuitems1 ORDER BY title ASC",
          [],
          (_, { rows }) => {
            resolve(rows._array);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      reject
    );
  });
}

export function saveMenuItems(menuItems) {
  db.transaction(tx => {
    tx.executeSql(
      `insert into menuitems1 (id, name, price, description, image, category) values ${menuItems
        .map(
          item =>
            `("${item.id}", "${item.name}", "${item.price}", "${item.description}", "${item.image}", "${item.category}")`
        )
        .join(", ")}`
    );
  });
}
// Filters menu items by search query and selected categories.

export async function filterByQueryAndCategories(query, activeCategories = []) {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        let sql = "select * from menuitems1 where name like ?";
        const params = [`%${query}%`];

        if (activeCategories.length > 0) {
          sql += ` and category in (${activeCategories.map(() => "?").join(", ")})`;
          params.push(...activeCategories);
        }

        tx.executeSql(
          sql,
          params,
          (_, { rows }) => resolve(rows._array)
        );
      },
      reject
    );
  });
}

}
