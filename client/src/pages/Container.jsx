import React from "react";
import { useCookies } from "react-cookie";

export function Container() {
  const [cookies] = useCookies(["container_id"]);
  const containerId = cookies.container_id;

  React.useEffect(() => {
    console.log("Container ID:", containerId); // Access `container_id` cookie
  }, [containerId]);

  return <div>Container ID: {containerId}</div>;
}
