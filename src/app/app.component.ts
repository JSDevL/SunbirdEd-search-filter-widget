import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentSearchFilter: any;

  filterFormTemplateConfig = [
    {
      index: 0,
      facet: 'se_boards',
      labelText: 'Board',
      defaultSelectionText: 'Selected',
      zeroSelectionText: 'Select Board',
      multiple: false
    },
    {
      index: 1,
      facet: 'se_mediums',
      labelText: 'Medium',
      defaultSelectionText: 'Selected',
      zeroSelectionText: 'Select Medium',
      multiple: true
    },
    {
      index: 0,
      facet: 'se_gradeLevels',
      labelText: 'Class',
      defaultSelectionText: 'Selected',
      zeroSelectionText: 'Select Class',
      multiple: true
    }
  ];

  searchResultFacets = [
    {
      "values": [
        {
          "name": "tamil",
          "count": 20
        },
        {
          "name": "english",
          "count": 493
        },
        {
          "name": "hindi",
          "count": 117
        },
        {
          "name": "bengali",
          "count": 1
        },
        {
          "name": "urdu",
          "count": 1
        },
        {
          "name": "gujarati",
          "count": 1
        },
        {
          "name": "sanskrit",
          "count": 36
        },
        {
          "name": "telugu",
          "count": 8
        },
        {
          "name": "assamese",
          "count": 46
        }
      ],
      "name": "se_mediums"
    },
    {
      "values": [
        {
          "name": "state (kerala)",
          "count": 2
        },
        {
          "name": "state (karnataka)",
          "count": 2
        },
        {
          "name": "state (manipur)",
          "count": 1
        },
        {
          "name": "state (andhra pradesh)",
          "count": 8
        },
        {
          "name": "state (maharashtra)",
          "count": 1
        },
        {
          "name": "cbse",
          "count": 286
        },
        {
          "name": "state (tamil nadu)",
          "count": 236
        }
      ],
      "name": "se_boards"
    },
    {
      "values": [
        {
          "name": "course assessment",
          "count": 232
        },
        {
          "name": "explanation content",
          "count": 42650
        },
        {
          "name": "learning resource",
          "count": 33396
        },
        {
          "name": "content playlist",
          "count": 3074
        },
        {
          "name": "textbook unit",
          "count": 724
        },
        {
          "name": "etextbook",
          "count": 457
        },
        {
          "name": "practice question set",
          "count": 3870
        },
        {
          "name": "digital textbook",
          "count": 2591
        },
        {
          "name": "course",
          "count": 1436
        },
        {
          "name": "teacher resource",
          "count": 3581
        },
        {
          "name": "lesson plan unit",
          "count": 49
        }
      ],
      "name": "primaryCategory"
    },
    {
      "values": [
        {
          "name": "application/vnd.ekstep.h5p-archive",
          "count": 1061
        },
        {
          "name": "application/vnd.ekstep.html-archive",
          "count": 3474
        },
        {
          "name": "video/webm",
          "count": 499
        },
        {
          "name": "application/pdf",
          "count": 12728
        },
        {
          "name": "video/x-youtube",
          "count": 19587
        },
        {
          "name": "application/vnd.android.package-archive",
          "count": 9
        },
        {
          "name": "audio/mp3",
          "count": 1
        },
        {
          "name": "text/x-url",
          "count": 38
        },
        {
          "name": "application/epub",
          "count": 630
        },
        {
          "name": "application/vnd.ekstep.content-collection",
          "count": 6681
        },
        {
          "name": "application/vnd.ekstep.ecml-archive",
          "count": 24932
        },
        {
          "name": "application/vnd.sunbird.questionset",
          "count": 6
        },
        {
          "name": "video/mp4",
          "count": 22414
        }
      ],
      "name": "mimeType"
    },
    {
      "values": [
        {
          "name": "class 9",
          "count": 4
        },
        {
          "name": "class 8",
          "count": 4
        },
        {
          "name": "class 10",
          "count": 36
        },
        {
          "name": "class 1",
          "count": 464
        },
        {
          "name": "class 3",
          "count": 36
        },
        {
          "name": "class 2",
          "count": 65
        },
        {
          "name": "class 5",
          "count": 24
        },
        {
          "name": "class 4",
          "count": 47
        },
        {
          "name": "class 12",
          "count": 36
        },
        {
          "name": "class 7",
          "count": 1
        },
        {
          "name": "class 6",
          "count": 23
        }
      ],
      "name": "se_gradeLevels"
    },
    {
      "values": [
        {
          "name": "general science",
          "count": 1
        },
        {
          "name": "mathematics",
          "count": 280
        },
        {
          "name": "botany",
          "count": 1
        },
        {
          "name": "skills",
          "count": 47
        },
        {
          "name": "accountancy and auditing",
          "count": 1
        },
        {
          "name": "tamil",
          "count": 20
        },
        {
          "name": "hospital management",
          "count": 1
        },
        {
          "name": "computer science",
          "count": 1
        },
        {
          "name": "geography",
          "count": 2
        },
        {
          "name": "physics",
          "count": 168
        },
        {
          "name": "english",
          "count": 87
        },
        {
          "name": "urdu",
          "count": 1
        },
        {
          "name": "environmental studies",
          "count": 3
        },
        {
          "name": "chemistry",
          "count": 10
        },
        {
          "name": "advance tamil",
          "count": 2
        },
        {
          "name": "accountancy auditing",
          "count": 1
        },
        {
          "name": "biology",
          "count": 6
        },
        {
          "name": "social",
          "count": 3
        },
        {
          "name": "business studies",
          "count": 1
        },
        {
          "name": "history",
          "count": 2
        },
        {
          "name": "social science",
          "count": 4
        },
        {
          "name": "environmental science",
          "count": 37
        },
        {
          "name": "home science",
          "count": 37
        },
        {
          "name": "economics",
          "count": 2
        },
        {
          "name": "accountancy",
          "count": 11
        },
        {
          "name": "science",
          "count": 50
        },
        {
          "name": "hindi",
          "count": 4
        },
        {
          "name": "social studies",
          "count": 1
        }
      ],
      "name": "se_subjects"
    }
  ];
}
