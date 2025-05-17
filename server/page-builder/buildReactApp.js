import React from "react";
import { componentRegistry } from "../../cms/registry.js";

/**
 * Builds a React component tree from a layout configuration
 * @param {Object} layout - The layout configuration object
 * @param {Object} loadedComponents - Object containing React component implementations
 * @returns {React.ReactElement} The rendered React component tree
 */
export function buildReactApp(layout, loadedComponents) {
  // If layout is null or undefined, return null
  if (!layout) return null;

  // Get the component type from the components registry using the layout's component ID
  const componentId = layout.component;
  const componentConfig = componentRegistry[componentId];

  if (!componentConfig) {
    console.warn(
      `Component with ID "${componentId}" not found in components registry`,
    );
    return null;
  }

  // Get the actual React component based on its name
  const ComponentType = loadedComponents[componentConfig.name];

  if (!ComponentType) {
    console.warn(
      `Component implementation "${componentConfig.name}" not found in loaded components`,
    );
    return null;
  }

  // Prepare props from the layout
  const props = { ...(layout.props || {}) };

  // If the component needs server-side props, we'd handle that here
  // For server-rendered content, the data would be passed in from the server
  if (
    componentConfig.serverSideProps &&
    componentConfig.serverSideProps.length > 0
  ) {
    // In a real implementation, this would use pre-fetched data
    props.__serverData = props.__serverData || {};

    // Add a flag to indicate this component has server-side data requirements
    props.__hasServerProps = true;
  }

  // Process children if they exist
  let children = null;
  if (
    layout.children &&
    Array.isArray(layout.children) &&
    layout.children.length > 0
  ) {
    // Filter out any invalid children and build the component tree recursively
    children = layout.children
      .filter((childLayout) => childLayout && childLayout.component)
      .map((childLayout, _index) =>
        buildReactApp(childLayout, loadedComponents),
      )
      .filter(Boolean); // Remove any null results

    // If we have no valid children after filtering, set children to null
    if (children.length === 0) {
      children = null;
    }
  }

  // Render the component with its props and children
  return React.createElement(
    ComponentType,
    { key: layout.id, ...props },
    children,
  );
}

/**
 * Loads all required components based on the layout
 * @param {Object} layout - The layout configuration
 * @returns {Object} Map of component names to their implementations
 */
export async function loadComponentsFromLayout(layout) {
  const requiredComponentIds = new Set();

  // Helper function to collect all component IDs from the layout
  function collectComponentIds(layoutNode) {
    if (!layoutNode || !layoutNode.component) return;

    requiredComponentIds.add(layoutNode.component);

    if (layoutNode.children && Array.isArray(layoutNode.children)) {
      layoutNode.children.forEach(collectComponentIds);
    }
  }

  collectComponentIds(layout);

  // Map of component names to their implementations
  const loadedComponents = {};

  // Direct import for App component to avoid dynamic loading
  if (requiredComponentIds.has("550e8400-e29b-41d4-a716-446655440000")) {
    try {
      const { App } = require("../static/main.js");
      loadedComponents["App"] = App;
      console.info("Loaded App component directly");
    } catch (error) {
      console.error(`Failed to load App component: ${error.message}`);
    }
  }
  
  // Load remaining components from the build folder
  for (const id of requiredComponentIds) {
    const componentConfig = componentRegistry[id];
    // Skip App component as it's already loaded
    if (!componentConfig || componentConfig.name === "App") {
      continue;
    }

    const { name } = componentConfig;
    try {
      // Import component from the build folder
      const path = `../static/${name}.js`;
      
      if (typeof window !== "undefined") {
        // Client-side - dynamic import
        const module = await import(path);
        loadedComponents[name] = module.default || module[name];
      } else {
        // Server-side - CommonJS require
        const module = require(path);
        loadedComponents[name] = module.default || module[name];
      }
      
      console.info(`Loaded component: ${name}`);
    } catch (error) {
      console.error(`Failed to load component ${name}: ${error.message}`);
    }
  }

  return loadedComponents;
}

/**
 * Loads the App component directly without using the layout
 * @returns {React.ReactElement|null} The App component or null if loading fails
 */
export function loadAppComponent() {
  try {
    const { App } = require("../static/main.js");
    return App;
  } catch (error) {
    console.error(`Failed to load App component directly: ${error.message}`);
    return null;
  }
}

/**
 * Main function to render a React app from a layout
 * @param {Object} layout - The layout configuration
 * @returns {Promise<React.ReactElement>} The rendered React component
 */
export async function renderAppFromLayout(layout) {
  if (!layout) {
    console.error("Layout configuration is missing");
    return null;
  }
  
  try {
    // Load all components needed for the layout
    const loadedComponents = await loadComponentsFromLayout(layout);
    
    if (Object.keys(loadedComponents).length === 0) {
      console.error("No components were loaded successfully");
      return null;
    }
    
    // Build the component tree
    return buildReactApp(layout, loadedComponents);
  } catch (error) {
    console.error(`Error rendering app from layout: ${error.message}`);
    return null;
  }
}
