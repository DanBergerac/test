import { Application, DisplayObject } from "pixi.js";

export class Manager {
    private constructor() { /*this class is purely static. No constructor to see here*/ }

    // Safely store variables for our game
    private static app: Application;
    private static currentScene: IScene;

    public static Scaled_height: number;
    public static Scaled_width: number;
    public static Delta: number;
    public static FPS: number;
    

    // We no longer need to store width and height since now it is literally the size of the screen.
    // We just modify our getters
    public static get width(): number {
        var El = document.getElementById("pixi-canvas");
        if (El == null) return 0;
        return El.clientWidth ;
    }

    

    public static get height(): number {
        var El = document.getElementById("pixi-canvas");
        if (El == null) return 0;  
      
        return El.clientHeight;
    }

    // Use this function ONCE to start the entire machinery
    public static initialize(background: number): void {

        Manager.FPS = 1;
        Manager.Scaled_height = 1000;
        Manager.Scaled_width  = Math.floor(Manager.width*Manager.Scaled_height/Manager.height);
        
        // Create our pixi app
        Manager.app = new Application<HTMLCanvasElement>({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: false,
            backgroundColor: background,
        });


        window.addEventListener("resize", Manager.resize);
        Manager.resize();
        
        // Add the ticker
         Manager.app.ticker.add(Manager.update)

    }

    public static resize(): void {
       
        Manager.Scaled_height = 1000;
        Manager.Scaled_width  = Math.floor(Manager.width*Manager.Scaled_height/Manager.height);


        console.log(Manager.Scaled_width,Manager.Scaled_height);

        Manager.app.view.width  = Manager.Scaled_width;
        Manager.app.view.height = Manager.Scaled_height;

        Manager.app.screen.width  = Manager.Scaled_width;
        Manager.app.screen.height = Manager.Scaled_height;

        if (Manager.app.view.style !== undefined)
        {
             Manager.app.view.style.width  = "100%";
             Manager.app.view.style.height = "100%";
        } 
             
    }

    // Call this function when you want to go to a new scene
    public static changeScene(newScene: IScene): void {
        // Remove and destroy old scene... if we had one..
        if (Manager.currentScene) {
            Manager.app.stage.removeChild(Manager.currentScene);
            Manager.currentScene.destroy();
        }

        // Add the new one
        Manager.currentScene = newScene;
        Manager.app.stage.addChild(Manager.currentScene);
    }

    // This update will be called by a pixi ticker and tell the scene that a tick happened
    private static update(framesPassed: number): void {


        // Put Delta in a var
        Manager.Delta = Manager.app.ticker.deltaMS;
        Manager.FPS = Math.ceil(Manager.app.ticker.FPS);


        // Let the current scene know that we updated it...
        // Just for funzies, sanity check that it exists first.
        if (Manager.currentScene)
        { 
            Manager.currentScene.update(framesPassed);
        }
        

    }
}

// This could have a lot more generic functions that you force all your scenes to have. Update is just an example.
// Also, this could be in its own file...
export interface IScene extends DisplayObject {
    update(framesPassed: number): void;

}