import { Container, FederatedPointerEvent, Sprite, TextStyle, Text } from "pixi.js";
import { IScene, Manager } from "./manager";
import { scene_menu } from './scene_menu'; 

export class scene_text extends Container implements IScene{



    // We promoted clampy to a member of the class
    private background: Sprite;
    private BackButton: Sprite;

    private Text_style: TextStyle;
    private MyText: Text;
    private TextTimer: number;
    private TextCycle: number;

    private FPS_style: TextStyle;
    private FPS_Text: Text;

    constructor() {
        super(); // Mandatory! This calls the superclass constructor.
       


        // Add background
        this.background = Sprite.from("background-menu.jpg");
        this.background.anchor.set(0.0);
        this.background.x = 0;
        this.background.y = 0;
        this.addChild(this.background);

        // Font Setup
        this.TextTimer = 0;
        this.TextCycle = 0;
        this.Text_style = new TextStyle({
            fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
            fontSize: 100,
            align:"center",
          });

        this.MyText = new Text("12😃😘3456😃😘",this.Text_style);
        this.MyText.anchor.set(0.5);
        this.addChild(this.MyText);    
        this.updateText();



        this.BackButton = Sprite.from("menu_back.png");
        this.BackButton.anchor.set(0.0);
        this.BackButton.x = -150;
        this.BackButton.y = -150;
        this.BackButton.on("pointertap", (e: FederatedPointerEvent)=>{this.ButtonInteraction(e)},this);
        this.BackButton.eventMode = 'dynamic';
        this.BackButton.cursor = 'pointer';
        this.addChild(this.BackButton);
        
        // Setup FPS text counter
        this.FPS_style = new TextStyle({
            fontFamily: ['Helvetica'],
            fontSize: 25,
            align:"right",
          });
        this.FPS_Text = new Text("FPS:123",this.FPS_style);
        this.FPS_Text.x =  Manager.Scaled_width-120;
        this.FPS_Text.y = 20;
        this.addChild(this.FPS_Text);    

    }

    public updateText() 
    {

        // Create Fake Latin sentence using word list
        var Words = Array("Lorem","ipsum","dolor","sit","amet,","consectetur","adipiscing","elit,","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua.","Ut","enim","ad","minim","veniam,","\n","\n","nostrud","exercitation","ullamco",'😁','😍','🤣','🤣','😀','😍','🤪','🤢','😱');
        var TempText = "";
        for (var i =0; i<6;i++)
        TempText +=Words[ Math.floor(Math.random()*Words.length)]+" ";


        // Change fontFamily
        switch (Math.floor(Math.random()*3)) {
        case 0:
            this.Text_style.fontFamily = ['Impact'];
        break;
            
        case 1:
            this.Text_style.fontFamily = ['Arial Black'];
        break;
       
        case 2:
            this.Text_style.fontFamily = ["\"Comic Sans MS\", cursive, sans-serif"];
        break;

        default:
            this.Text_style.fontFamily = ['Helvetica', 'Arial', 'sans-serif'];
        break;
            
        }

       // Change fontWeight
       switch (Math.floor(Math.random()*3)) {
        case 0:
            this.Text_style.fontWeight =  "bold";
        break;
            
        case 1:
            this.Text_style.fontWeight =  "lighter";
        break;
       
        case 2:
            this.Text_style.fontWeight =  "bolder";
        break;

        default:
            this.Text_style.fontWeight =  "normal";
        break;
            
        }

        // Change fontstyle
        switch (Math.floor(Math.random()*3)) {
            case 0:
                this.Text_style.fontStyle = 'oblique';
            break;
               
            case 1:
                this.Text_style.fontStyle = 'italic';
            break;

            default:
                this.Text_style.fontStyle = 'normal';
             break;
        }

        this.Text_style.fontSize = 15+Math.random()*100;
        this.MyText.text = TempText;
        this.MyText.transform.rotation=(Math.random()-0.5)*0.3;

    }

    private ButtonInteraction(e: FederatedPointerEvent): void {
        console.log(e)
        Manager.changeScene(new scene_menu());
    }

    public update(): void 
    {
        // Update FPS Counter
        this.FPS_Text.text = "FPS:"+Manager.FPS;
        this.FPS_Text.x =  Manager.Scaled_width-this.FPS_Text.width-5;

        // Update Text timer
        this.TextTimer +=Manager.Delta;
        if (this.TextTimer>2000)
        {
            this.updateText() ;
            this.TextTimer -=2000;
        }
        
        // quick back button slide
        this.BackButton.x *=0.8;
        this.BackButton.y *=0.8;
        
    
        // scale Background
        this.background.width  = Manager.Scaled_width;
        this.background.height = Manager.Scaled_height;

        // Center Text
        this.TextCycle +=Manager.Delta*0.001;
        this.MyText.x = Manager.Scaled_width * 0.5 + Math.cos(this.TextCycle)*200;
        this.MyText.y = Manager.Scaled_height * 0.5 + Math.cos(this.TextCycle*2)*300;
        this.MyText.transform.rotation= this.TextCycle*0.3;


    }


}
