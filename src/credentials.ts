import { EC2MetadataCredentials, EnvironmentCredentials, SharedIniFileCredentials } from 'aws-sdk';

export function getCredentials(namedProfile: string) {
  var getCredentials = function() {
    var profile = process.env.AWS_PROFILE || namedProfile;
    if(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && !profile) {
      return new EnvironmentCredentials('AWS');
    }

    if(!profile) {
      return new EC2MetadataCredentials();
    }

    return new SharedIniFileCredentials({
        profile: profile || 'default'
    });
  }

  return getCredentials();
}
