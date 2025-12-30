import { Heading } from '@components';

const Timeline = ({ events = [], currentStatus }) => {
  return (
    <div className="w-full">
      <Heading variant="medium" className="mb-4">
        Order Timeline
      </Heading>

      <ul className="relative ml-3 space-y-6 border-l border-gray-200">
        {events.map((event, idx) => {
          const isCurrent = event.status === currentStatus;

          return (
            <li key={idx} className="relative pl-6">
              <span
                className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full
                  ${isCurrent ? 'bg-green-600' : 'bg-gray-300'}`}
              />

              <div className="flex flex-col gap-1">
                <span
                  className={`text-sm font-medium
                    ${isCurrent ? 'text-green-700' : 'text-gray-500'}`}
                >
                  {event.date}
                </span>

                <span className="text-sm sm:text-base text-gray-800">{event.status}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Timeline;
