import routes from "../../data/routes.json";

export const findByName = (name: string) => {
    return routes.routes.find((n) => n.name.includes(name));
};
