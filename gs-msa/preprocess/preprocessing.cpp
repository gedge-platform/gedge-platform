#include <opencv2/opencv.hpp>
#include <iostream>
#include <stdio.h>
//#pragma warning(disable:4996)

using namespace cv;
using namespace std;

int atoi(char const *c)
{
	int value = 0;
	int positive = 1;

	if(*c == '\0')
		return 0;

	if(*c == '-')
		positive = -1;

	while(*c)
	{
		if(*c > '0' && *c < '9')
			value = value * 10 + *c - '0';
	 	c++;
	}
	return value*positive;
}

int main(int argc, char **argv)
{
	Mat frame;
	VideoCapture cap;
	int frame_count = 0;

	char video_name[256] = { '\0' };
	strcpy(video_name, argv[1]);


	// webcam
	if (!video_name[1])
		cap.open(atoi(video_name));
	else
		cap.open(video_name);

	if (!cap.isOpened()) {
		printf("Please re-check the video path.");
		return -1;
	}

	char save_path[256] = {'\0'};
	strcpy(save_path, argv[2]);

	if (!save_path[1]){
		printf("Please re-check the save path.");
		return -1;
	}

	while (1) {
		cap >> frame;
		if (frame.empty())
		{
			printf("Capture Finished");
			return 0;
		}

		char save_filename[256] = { '\0' };
		char temp[256] = { '\0' };

		strcat(save_filename, save_path);
		sprintf(temp, "/yolo_frame_%d.jpg", frame_count);
		strcat(save_filename, temp);
		imwrite(save_filename, frame);
		frame_count++;

	}


}
