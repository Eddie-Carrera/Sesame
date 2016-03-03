import requests
import json
from gpiozero import Button
from signal import pause
from subprocess import call
import os
from time import sleep
button = Button(2)
active = False


while True:
    if active == True:
        print("Taking the picture")
        os.system("raspistill -o test.jpg")
        sleep(5);
        active = False

        print("Processing the Picture")
        r = requests.post('http://lockapp.mybluemix.net/classify', files={'image': open('./test.jpg','rb')})
        print (r.text)
        x = json.loads(r.text)
        #print (x['images'][0]['scores'][0]['score'],',\n')
        for i in x['images']:
            print (i,"Going into the images field")
            if 'scores' in i:
                print ("Accessing i,", i)
                for x in i['scores']:
                    if x['score'] != False:
                        print (x['score'],"We get to the score \n")
                        if x['score']> .49:
                            print("Welcome")
                            os.system("sudo ./servo_Close")

                            sleep(5)
                            os.system("sudo ./servo_unlock")
            else:
                print ("You are not Authentificated, Go AWAY!")
        #os.system("sudo ./servo_Close")
    #print ("Before Button PReess WAit")
    #button.wait_for_press()
    if button.is_pressed:
        active = True
        #print("After Button Press")
    #button.wait_for_release()



pause()


