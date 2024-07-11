import { Manager } from './manager'; 
import { scene_menu } from './scene_menu'; 

Manager.initialize(0x990099);

Manager.changeScene(new scene_menu());
