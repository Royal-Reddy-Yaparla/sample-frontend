import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MockTestService } from '../mocktest.service';
import { AiMockComponent } from '../ai-mock/ai-mock.component';

 
export interface MockTestInterview {
  id: number;
  title: string;
  mock_id:any;
  description: string;
  courseId: number;
  fee: number;
  freeAttempts: number;
  testType: string;
  image: string;
  enrollmentStatus?: { isEnrolled: boolean; isCompleted: boolean };
  Course_Title:string;
}
 
@Component({
  selector: 'app-studentmock',
  standalone: true,
  imports: [CommonModule, RouterModule,AiMockComponent],
  templateUrl: './studentmock.component.html',
  styleUrls: ['./studentmock.component.css']
})
export class StudentmockComponent implements OnInit {
  showMockCards: boolean = false;
  mockTests: MockTestInterview[] = [];
  userId: number | null = null; // Dynamically set from localStorage
  ActiveTab : string = "MentorMock";
  courseId: any; // Replace with actual courseId value
 
  constructor(
    private mockTestService: MockTestService,
    private router: Router,
    private sanitizer: DomSanitizer // Inject DomSanitizer here
  ) {}
 
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.retrieveUserId(); // Retrieve userId from localStorage

    this.loadMockTests();
  }
  retrieveUserId(): void {
    const storedUserId = localStorage.getItem('id');
    if (storedUserId) {
      this.userId = +storedUserId; // Convert string to number
      console.log('Retrieved userId from localStorage:', this.userId);
    } else {
      console.error('User ID not found in localStorage.');
      alert('User ID is required to proceed.');
    }
  }
 
  image(toolImage: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${toolImage}`);
  }
 
  loadMockTests(): void {
    this.mockTestService.getMockTests().subscribe(
      {next:(data: MockTestInterview[]) => {
        console.log('Mock tests data:', data);
        this.mockTests = data;
      },
      error:error => {
        console.error('Error fetching mock tests', error);
        alert('Failed to load mock tests. Please try again later.');
      }}
    );
  }
  
  viewDetails(testId: any, courseId:any,test:any): void {
    console.log('viewDetails called with testId:', testId);
    console.log('UserId:', this.userId);

    // Find the selected test from the local list
    const selectedTest = this.mockTests.find(test => test.mock_id === testId);
    console.log('Selected Test:', selectedTest);
 
    if (selectedTest) {
        if (this.userId && courseId && testId) {
            this.mockTestService.getMockStatus(this.userId, courseId, testId).subscribe(
               {next:(status: any) => {
                    console.log('Mock status fetched:', status);
 
                    // Check if enrollmentStatus exists in the API response
                    if (status && status.enrollmentStatus) {
                        // Update selectedTest's enrollmentStatus with the fetched data
                        selectedTest.enrollmentStatus = status.enrollmentStatus;
 
                        // Log the updated selectedTest to check if the enrollmentStatus is set correctly
                        console.log('Updated Selected Test:', selectedTest);
 
                        // Check if the enrollment status meets the required conditions
                        if (selectedTest.enrollmentStatus?.isEnrolled) {
                            console.log('Navigating to /slotdetails with queryParams:', {
                                userId: this.userId,
                                courseId: courseId,
                                mockTestInterviewId: testId
                            });
 
                            this.router.navigate(['/slotdetails'], {
                                queryParams: {
                                    userId: this.userId,
                                    courseId: courseId,
                                    mockTestInterviewId: testId
                                }
                            }).then(success => {
                                if (success) {
                                    console.log('Navigation succeeded');
                                } else {
                                    console.log('Navigation failed');
                                }
                            }).catch(err => {
                                console.error('Navigation error:', err);
                            });
                        } else {
                            this.openPopup();
                            if (!selectedTest.enrollmentStatus?.isEnrolled){
                              this.popuptext = `You must enroll ${test.Course_Title=="Unknown Course"?test.title:test.Course_Title} to Book slot in ${test.title}`
                              this.showenroll = true;
                            }
                            else{
                              this.popuptext = `You must Complete ${test.Course_Title} to Book slot in ${test.title}`
                              this.showenroll = false;
                            }
                            this.presentid=courseId
                        }
                    } else {
                        alert('Failed to fetch enrollment status.');
                    }
                },
                error:(error) => {
                    console.error('Error fetching mock status:', error);
                    alert('Failed to fetch mock status.');
                }}
            );
        } else {
            console.error('One or more parameters are undefined:', {
                userId: this.userId,
                courseId: courseId,
                testId
            });
            alert('Invalid parameters provided.');
        }
    } else {
        alert('Test not found.');
    }
}

isOpen = false;
popuptext="";
showenroll = false;
presentid = 0;

openPopup() {
  this.isOpen = true;
}

closePopup() {
  this.isOpen = false;
  this.popuptext="";
  this.showenroll = false;
  this.presentid = 0;
}
 
 
}