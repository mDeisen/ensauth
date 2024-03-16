import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EnsauthModule = buildModule("EnsauthV36Module", (m) => {
  const ensauth = m.contract("Ensauth");
  
  return { ensauth };
});

export default EnsauthModule;


