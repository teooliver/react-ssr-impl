import React from "react";
import { componentRegistry } from "../../cms/registry";

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

  // Load each component dynamically
  for (const id of requiredComponentIds) {
    const componentConfig = componentRegistry[id];
    if (!componentConfig) {
      console.warn(
        `Component with ID "${id}" not found in components registry`,
      );
      continue;
    }

    const { name } = componentConfig;
    try {
      // In a production environment, use dynamic imports
      if (typeof window !== "undefined") {
        // Client-side - dynamic import
        const module = await import(`./src/${name}.jsx`);
        loadedComponents[name] = module.default || module[name];
      } else {
        // Server-side - require (for Node.js SSR)
        try {
          // Use require for server-side rendering
          const module = require(`./src/${name}.jsx`);
          loadedComponents[name] = module.default || module[name];
        } catch (_) {
          // If .jsx extension fails, try .js (for compiled files)
          const module = require(`./build/${name}.js`);
          loadedComponents[name] = module.default || module[name];
        }
      }
    } catch (error) {
      console.error(`Failed to load component ${name}:`, error);
    }
  }

  return loadedComponents;
}

/**
 * Main function to render a React app from a layout
 * @param {Object} layout - The layout configuration
 * @returns {Promise<React.ReactElement>} The rendered React component
 */
export async function renderAppFromLayout(layout) {
  try {
    // Load all components needed for the layout
    const loadedComponents = await loadComponentsFromLayout(layout);

    // Build the component tree
    return buildReactApp(layout, loadedComponents);
  } catch (error) {
    console.error("Error rendering app from layout:", error);
    return null;
  }
}

/**
 * Fetches data for components that require server-side props
 * @param {Object} layout - The layout configuration
 * @returns {Object} Map of component IDs to their fetched data
 */
export async function fetchComponentData(layout) {
  const componentsWithServerProps = new Map();
  const fetchPromises = [];

  // Helper function to find components with server-side props
  function findComponentsWithServerProps(layoutNode) {
    if (!layoutNode || !layoutNode.component) return;

    const componentId = layoutNode.component;
    const componentConfig = componentRegistry[componentId];

    if (componentConfig?.serverSideProps?.length > 0) {
      // Store the component and create fetch promises for each data endpoint
      componentsWithServerProps.set(componentId, {
        layout: layoutNode,
        data: {},
      });

      for (const endpoint of componentConfig.serverSideProps) {
        const promise = fetch(endpoint)
          .then((response) => response.json())
          .then((data) => {
            const componentData = componentsWithServerProps.get(componentId);
            componentData.data[endpoint] = data;
          })
          .catch((error) => {
            console.error(`Error fetching data from ${endpoint}:`, error);
          });

        fetchPromises.push(promise);
      }
    }

    // Process children recursively
    if (layoutNode.children && Array.isArray(layoutNode.children)) {
      layoutNode.children.forEach(findComponentsWithServerProps);
    }
  }

  findComponentsWithServerProps(layout);

  // Wait for all data fetches to complete
  await Promise.all(fetchPromises);

  // Transform the map to a simple object for easier consumption
  const result = {};
  for (const [id, { data }] of componentsWithServerProps.entries()) {
    result[id] = data;
  }

  return result;
}
