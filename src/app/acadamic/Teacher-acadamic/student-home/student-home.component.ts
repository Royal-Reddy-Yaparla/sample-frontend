import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-student-home',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent {
  institute = {
    name: 'ABC Institute of Technology',
    location: 'Hyderabad, India',
  };

  userDetails = {
    image: 'data:image/webp;base64,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',
    name: 'Kittu',
    age: 16,
    class: '10th Grade',
    find:'Mr.krishna',
    teacher:'Ms.keerthi',
    achievements: ['Top Scorer in Math', 'Science Fair Winner'],
    sports: ['Football', 'Basketball']
  };

  upcomingEvents = [
    { date: '2024-12-01', name: 'Annual Sports Day', location: 'ABC Stadium' },
    { date: '2024-12-15', name: 'Science Exhibition', location: 'Main Auditorium' }
  ];
}

