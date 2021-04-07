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
      facet: 'se_boards',
      labelText: 'Board',
      placeholderText: 'Select Board',
      multiple: false
    },
    {
      facet: 'se_mediums',
      labelText: 'Medium',
      placeholderText: 'Select Medium',
      multiple: true
    },
    {
      facet: 'se_gradeLevels',
      labelText: 'Class',
      placeholderText: 'Select Class',
      multiple: true
    }
  ];

  searchResultFacets = [];

  searchContent(filter) {
    this.currentSearchFilter = filter;

    // @ts-ignore
    fetch("https://staging.sunbirded.org/api/content/v1/search?orgdetails=orgName,email", {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ur;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "ts": "2021-04-07T13:14:07+05:30",
        "x-app-id": "staging.sunbird.portal",
        "x-app-version": "3.8.0",
        "x-channel-id": "01268904781886259221",
        "x-device-id": "f0c2acf357596f39e310109e9d930d5b",
        "x-msgid": "31192c95-1b08-8df3-1254-4fdf395f2932",
        "x-org-code": "01268904781886259221",
        "x-request-id": "31192c95-1b08-8df3-1254-4fdf395f2932",
        "x-session-id": "a28c3dd9-3a89-ad05-0ae1-560dbb1992fc",
        "x-source": "web"
      },
      "referrer": "https://staging.sunbirded.org/explore/1?se_gradeLevels=class%201&se_gradeLevels=class%202&selectedTab=all",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": JSON.stringify({
        "request": {
          "filters": this.currentSearchFilter,
          "fields": [
            "name",
            "appIcon",
            "mimeType",
            "gradeLevel",
            "identifier",
            "medium",
            "pkgVersion",
            "board",
            "subject",
            "resourceType",
            "primaryCategory",
            "contentType",
            "channel",
            "organisation",
            "trackable"
          ],
          "softConstraints": {
            "badgeAssertions": 98,
            "channel": 100
          },
          "mode": "soft",
          "facets": [
            "se_boards",
            "se_gradeLevels",
            "se_subjects",
            "se_mediums",
            "primaryCategory",
            "mimeType"
          ]
        }
      }),
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    }).then((r) => r.json())
      .then((r) => this.searchResultFacets = r.result.facets);
  }
}
