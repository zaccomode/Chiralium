export default interface Env { 
  /** Your D1 database binding. */
  D1: D1Database;
  
  // Other bindings used in the wrangler.toml 
  // file should be defined here as well.
}