
export interface HomeSection {
  name: string;
  traffic: string;
  event: string;
  time: Date;
}
export interface UpdateTrafficStats {
  model: any;
  traffic: string;
  reqIp: string;
  secunds: number;
}

export interface IBlogStats {
  name: string;
  blogId: string;
  event: string;
  time: string;
}
