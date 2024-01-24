#include <opencv2/opencv.hpp>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
//#pragma warning(disable:4996)

using namespace cv;
using namespace std;
/*
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
*/
/*
double atof(char *p_pszStr)
{
    double dTotal, dTmp;
    int i;

    for(i =0, dTotal =dTmp =0; p_pszStr[i] != '\0' ; ++i){

        if (!dTmp){
            dTotal *=10;
            dTotal +=p_pszStr[i] -'0';

            if (p_pszStr[i +1] =='.'){
                dTmp =0.1;
                ++i;
            }
        }
        else{
            dTotal += dTmp* (p_pszStr[i] -'0');
            dTmp *=0.1;
        }
    }

    return dTotal;
}
*/
// first argv : path prefix, secoud argv : video_save name, third argv : frame_count

int main(int argc, char **argv) {
	char path[1024] = { '\0' };
	strcpy(path, argv[1]);
	strcat(path, "/");

	double fps = 30;
	int fourcc = VideoWriter::fourcc('a', 'v', 'c', '1');

	VideoWriter result;
	char argv2[1024] = {'\0'};

	strcpy(argv2, path);
        strcat(argv2, argv[2]);
	strcat(argv2, "_output.mp4");
	//printf("%s\n", argv2);

	char temp_img_name[1024] = {'\0'};
	strcpy(temp_img_name, path);
	strcat(temp_img_name, "images/yolo_frame_0.jpg");

	Mat temp_frame = imread(temp_img_name);

	result.open(argv2, fourcc, fps, Size(temp_frame.cols, temp_frame.rows));
	int file_count = 0;
	int frame_count = atoi(argv[3]);

	while (file_count < frame_count) {
		char filename_img[1024] = {'\0'};
    char filename_txt[1024] = {'\0'};
		strcpy(filename_img, path);
		strcat(filename_img, "images/");
		strcat(filename_img, "yolo_frame_");
    strcpy(filename_txt, path);
		strcat(filename_txt, "txts/");
    strcat(filename_txt, "yolo_frame_");

		char filenum[100] = { '\0' };
		sprintf(filenum, "%d", file_count);
		//_itoa(file_count, filenum, 10);

		strcat(filename_img, filenum);
		strcat(filename_txt, filenum);
		strcat(filename_txt, ".txt");
		strcat(filename_img, ".jpg");

		//printf("%s\n", filename_img);
		//printf("%s\n", filename_txt);

		Mat frame = imread(filename_img);
		//printf("%s\n", filename_txt);
		if (frame.empty())
			return -1;

		FILE *txt = NULL;
		txt = fopen(filename_txt, "r");
		if (!txt)
			return -1;

		else {
			int width = frame.cols;
			int height = frame.rows;

			char line[1024] = { '\0' };
			char *pword;
			while (!feof(txt)) {
				fgets(line, 1024, txt);
				char obj_class[1024] = { '\0' };
				double box[5] = { 0 };

				pword = strtok(line, " ");
				if (!pword) break;
				box[0] = atoi(pword);

				pword = strtok(NULL, " ");
				if (!pword) break;
				double x = atof(pword);

				pword = strtok(NULL, " ");
				double y = atof(pword);

				pword = strtok(NULL, " ");
				double w = atof(pword);

				pword = strtok(NULL, " ");
				double h = atof(pword);

        //printf("%lf %lf %lf %lf %lf\n", box[0], x, y, w, h);

				// left, right, top, bottom
				box[1] = (x - w / 2.0) * width;
				box[2] = (x + w / 2.0) * width;
				box[3] = (y - h / 2.0) * height;
				box[4] = (y + h / 2.0) * height;

        //printf("%lf %lf %lf %lf %lf\n", box[0], box[1], box[2], box[3], box[4]);

				if (box[1] < 0) box[1] = 0;
				if (box[2] > width - 1) box[2] = width - 1;
				if (box[3] < 0) box[3] = 0;
				if (box[4] > height - 1) box[4] = height - 1;

				rectangle(frame, Rect(Point(int(box[1]), int(box[3])), Point(int(box[2]), int(box[4]))), Scalar(255, 255, 0), 2, 8, 0);
				//printf("%d, %d, %d, %d, %d\n", int(box[0]), int(box[1]), int(box[2]), int(box[3]), int(box[4]));

				FILE *name = NULL;
				name = fopen("./coco.names", "r");
				if (!name) {
					return -1;
				}

				int line_count = 0;
				char classline[1024] = { '\0' };
				while (!feof(name)) {
					fgets(classline, 1024, name);
					if (line_count == box[0]) {
						strcpy(obj_class, classline);
						break;
					}
					line_count++;
				}
				fclose(name);

				obj_class[strlen(obj_class) - 1] = '\0';
				putText(frame, obj_class, Point(box[1], box[3] - 10), 1, 2, Scalar(0, 0, 255), 3, 8);

			}

		}
		//imshow("asdfASDF", frame);
		//waitKey(0);
		result << frame;
		//printf("%s", frame);
		fclose(txt);
		file_count+=1;
	}
	return 0;
}
