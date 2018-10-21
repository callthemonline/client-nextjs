import blue from "@material-ui/core/colors/blue";
import {
  createGenerateClassName,
  createMuiTheme,
} from "@material-ui/core/styles";
import { SheetsRegistry } from "jss";

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    type: "light", // default. can be: dark
    primary: blue,
    divider: "#7E7", // green-ish ListItem background
  },
  typography: {
    useNextVariants: true,
  },
});

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (typeof window !== "undefined") {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!(global as any).__INIT_MATERIAL_UI__) {
    (global as any).__INIT_MATERIAL_UI__ = createPageContext();
  }

  return (global as any).__INIT_MATERIAL_UI__;
}
