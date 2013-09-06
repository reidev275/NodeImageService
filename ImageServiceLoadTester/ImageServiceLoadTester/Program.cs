using RestSharp;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ImageServiceLoadTester
{
	class Program
	{
		static void Main(string[] args)
		{
			var path = @"D:\Dev\ImageServiceLoadTester\ImageServiceLoadTester\Images\qa.tif";
			var bytes = File.ReadAllBytes(path);
			image = Convert.ToBase64String(bytes);

			extension = Path.GetExtension(path);

			var upload = Time(() => UploadImages());
			Console.WriteLine(items + " images uploaded in " + upload.TotalSeconds + " seconds.  " + (items / upload.TotalSeconds) + " operations / second");

			var dequeue = Time(() => DequeueImages());
			Console.WriteLine(items + " images dequeued in " + dequeue.TotalSeconds + " seconds.  " + (items / dequeue.TotalSeconds) + " operations / second");

			var status = Time(() => GetStatus());
			Console.WriteLine(items + " statuses checked in " + status.TotalSeconds + " seconds.  " + (items / status.TotalSeconds) + " operations / second");

			Console.ReadKey();
		}

		static int items = 1000;
		static string image;
		static string extension;
		static string host = "http://localhost:3000";

		static TimeSpan Time(Action action)
		{
			var start = DateTime.Now;
			Parallel.For(1, items, (i) =>
				{
					action();
				});
			return DateTime.Now - start;
		}
		
		
		static void DequeueImages()
		{

			var client = new RestClient(host);
			var request = new RestRequest("images/top", Method.PUT);
			var response = client.Execute<ImagesPutResponse>(request);
		}
		static void UploadImages()
		{
			var client = new RestClient(host);
			var request = new RestRequest("images", Method.POST);

			var model = new ImagesPostRequest
			{
				Account = "BOA",
				Project = "Super Important",
				Image = image,
				ImageFormat = ".tif"
			};
			request.RequestFormat = DataFormat.Json;
			request.AddBody(model);
			var response = client.Execute<ImagesPostResponse>(request);
		}
		static void GetStatus()
		{

			var client = new RestClient(host);
			var request = new RestRequest("images/7/status", Method.GET);
			var response = client.Execute<ImagesPutResponse>(request);
		}

	}


	class ImagesPostResponse
	{
		public string Id { get; set; }
		public string Location { get; set; }
	}

	class ImagesPostRequest
	{
		public string Account { get; set; }
		public string Project { get; set; }
		public string Image { get; set; }
		public string ImageFormat { get; set; }
	}
	
	class ImagesPutResponse
	{
		public DateTime Created_At { get; set; }
		public int Id { get; set; }
		public string Status { get; set; }
	}
}
