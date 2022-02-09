/**
 * DB Service for managing local storage
 */
class DBService {
  /**
   * Get a value from local storage
   * @param key The key to get
   */
  public static get(key: string): any {
    let item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  }

  /**
   * Set a value in local storage
   * @param key The key to set
   * @param value The value to set
   * @returns Promise<any>
   * */
  public static set(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve(value);
    });
  }

  /**
   *
   * @param key The key to remove
   * @returns Promise<any>
   */
  public static delete(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      localStorage.removeItem(key);
      resolve(true);
    });
  }

  //update
  public static update(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve(value);
    });
  }
}

export default DBService;
