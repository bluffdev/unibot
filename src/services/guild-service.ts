import { clientService } from './';
import { Guild, GuildChannel, GuildEmoji, Role, User } from 'discord.js';
import { Maybe } from '../utils';
import { channels, roles } from '../constants';

export class GuildService {
  private _guild: Guild;
  private _roleCache: Record<string, Maybe<Role>> = {
    [roles.Unverifed]: undefined,
  };

  private _channelCache: Record<string, Maybe<GuildChannel>> = {
    [channels.info.codeOfConduct]: undefined,
    [channels.blacklist.verify]: undefined,
  };

  constructor() {
    this._guild = clientService.guilds.cache.first();
  }

  public get(): Guild {
    return this._guild;
  }

  // Returns whether a member has a role
  // Can be overloaded with the string name of the role or a Role object
  public userHasRole(user: User, roleName: string | Role): boolean {
    const member = this.get().members.cache.get(user.id);
    if (!member) {
      return false;
    }

    if (typeof roleName === 'string') {
      const roleNameLower = roleName.toLowerCase();
      return member.roles.cache.filter(r => r.name.toLowerCase() === roleNameLower).size !== 0;
    } else {
      return member.roles.cache.filter(r => r === roleName).size !== 0;
    }
  }

  public getRole(roleName: string): Role {
    if (!this._roleCache[roleName]) {
      this._roleCache[roleName] = this.get()
        .roles.cache.filter(r => r.name === roleName)
        .first();
    }

    return this._roleCache[roleName];
  }

  public getChannel(chanName: string): GuildChannel {
    if (!this._channelCache[chanName]) {
      this._channelCache[chanName] = this.get()
        .channels.cache.filter(c => c.name === chanName)
        .first() as GuildChannel;
    }

    return this._channelCache[chanName];
  }

  public getEmoji(emojiName: string): Maybe<GuildEmoji> {
    const lowerEmojiName = emojiName.toLowerCase();
    return this.get()
      .emojis.cache.filter(e => e.name?.toLowerCase() === lowerEmojiName)
      .first();
  }
}