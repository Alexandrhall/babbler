import { TUser } from "../services/postConverter";

export function searchbarDashboard(users: TUser[], searchText: string) {
  const tempCamp = [...users];

  const searchList =
    tempCamp &&
    tempCamp.filter((usr) => {
      if (usr.username.toLowerCase().includes(searchText.toLowerCase())) {
        return usr;
      }
      if (searchText === "" || searchText === "Search...") return usr;
      else return undefined;
    });

  const result =
    searchList &&
    searchList.filter((usr) => {
      return usr !== undefined;
    });

  return result;
}
