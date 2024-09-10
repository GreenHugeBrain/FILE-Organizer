import os
import shutil

source_directory = 'Organized Files'

def listFiles(fileDir):
    list = os.listdir(fileDir)
    print(list)

def fileChecker(fileDir):
    for file in os.listdir(fileDir):
        file_path = os.path.join(fileDir, file)

        if os.path.isfile(file_path):

            if file.lower().endswith('mp4'):
                shutil.move(file_path, source_directory)
    

listFiles(r'C:\Users\GreenHugeBrain\Downloads')
fileChecker(r'C:\Users\GreenHugeBrain\Downloads')